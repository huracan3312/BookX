const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const Perks = require('./models/Perks.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const {S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const fs = require('fs');
const mime = require('mime-types');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
const bucket = process.env.S3_BUCKET;
const region =  process.env.S3_REGION

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
  optionSuccessStatus:200
}));
const client = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

async function uploadToS3(path, originalFilename, mimetype) {
  const parts = originalFilename.split('.');
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + '.' + ext;
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Body: fs.readFileSync(path),
    Key: newFilename,
    ContentType: mimetype,
    ACL: 'public-read',
  }));
  return `https://${bucket}.s3.${region}.amazonaws.com/RoomImages/${newFilename}`;
}

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get('/api/test', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json('test ok');
});

app.post('/api/register', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {name,lastName,phoneNumber,email,password} = req.body;
  try {
    const userDoc = await User.create({
      name,
      lastName,
      phoneNumber,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }

});

app.put('/api/register', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { name, lastName, phoneNumber, email, password } = req.body;

  try {
    const userDoc = await User.findOneAndUpdate(
      { email: email },
      {
        name,
        lastName,
        phoneNumber,
        password: bcrypt.hashSync(password, bcryptSalt),
      },
      { new: true }
    );

    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});



app.post('/api/login', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

app.get('/api/profile', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,lastName,phoneNumber,email,password,_id} = await User.findById(userData.id);
      res.json({name,lastName,phoneNumber,email,password,_id});
    });
  } else {
    res.json(null);
  }
});

app.post('/api/logout', (req,res) => {
  res.cookie('token', '').json(true);
});


app.post('/api/upload-by-link', async (req,res) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: '/tmp/' +newName,
  });
  const url = await uploadToS3('/tmp/' +newName, newName, mime.lookup('/tmp/' +newName));
  res.json(url);
});

const photosMiddleware = multer({dest:'/tmp'});
app.post('/api/upload', photosMiddleware.array('photos', 100), async (req,res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const {path,originalname,mimetype} = req.files[i];
    const url = await uploadToS3(path, originalname, mimetype);
    uploadedFiles.push(url);
  }
  res.json(uploadedFiles);
});

async function deletePhotoFromS3(filename) {
  try {
    const url = new URL(filename);
    const key = url.pathname.substring(1);
    const name = key.split('/').pop();
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: name,
    });
    await client.send(command);
  } catch (error) {
    throw error;
  }
}

app.delete('/api/delete-photo', async (req, res) => {
  try {
      const response = await deletePhotoFromS3(req.body.filename);
      res.status(200).send({ message: 'Foto eliminada correctamente' });
  } catch (error) {
      res.status(500).send({ error: 'Error al eliminar la foto' });
  }
});

app.post('/api/places', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    title,address,addedPhotos,description,price,
    perks,extraInfo,checkIn,checkOut,maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner:userData.id,price,
      title,address,photos:addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,
    });
    res.json(placeDoc);
  });
});

app.get('/api/user-places', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await Place.find({owner:id}) );
  });
});

app.get('/api/places/:id', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.put('/api/places', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/api/places', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      const places = await Place.find();
      return res.json(places);
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const bookedPlaces = await Booking.find({
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
      ]
    }).distinct('place');

    const availablePlaces = await Place.find({
      _id: { $nin: bookedPlaces }
    });

    res.json(availablePlaces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en la consulta de lugares' });
  }
});


app.delete('/api/places/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Place.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: 'Place deleted successfully' });
    } else {
      res.status(404).json({ error: 'Place not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting place' });
  }
});

app.post('/api/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    place,checkIn,checkOut,guests,name,phone,price,
  } = req.body;
  Booking.create({
    place,checkIn,checkOut,guests,name,phone,price,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});

app.get('/api/bookings', async (req, res) => {
  const { place, checkIn, checkOut } = req.query;
  
  try {
    mongoose.connect(process.env.MONGO_URL);

    const userData = await getUserDataFromReq(req);

    let query = { user: userData.id };

    if (place && checkIn && checkOut) {
      query = {
        user: userData.id,
        place: mongoose.Types.ObjectId(place),
        checkIn: { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) }
      };
    }

    const bookings = await Booking.find(query).populate('place');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookings' });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const bookingId = req.params.id;
  try {
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
});

app.get('/api/perks', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json( await Perks.find() );
});

app.post('/api/perks', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {
    name,description,icon,
  } = req.body;
  Perks.create({
    name,description,icon,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});



app.listen(4000);