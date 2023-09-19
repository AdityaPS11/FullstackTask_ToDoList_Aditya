// src/index.ts
import express from 'express';
import cors from 'cors';
import mongoose, {ConnectOptions} from 'mongoose';
import bodyParser from 'body-parser';
import * as mqtt from 'mqtt';
import cron from 'node-cron';
import Task from './models/Task';
import taskRoutes from './routes/taskRoutes';
import { createClient } from 'redis';

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

// Initialize MQTT client
const mqttClient = mqtt.connect('mqtt://localhost:1883');
const redisKey = 'FULLSTACK_TASK_ADITYA';
// Initialize Redis client
const client = createClient({
    password: 'd$6neLHA4Pz_zEP',
    socket:{
      host: 'redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com',
      port: 12675
    }
    
    ,
  });
const mongodbUri =
  'mongodb+srv://assignment_user:HCgEj5zv8Hxwa4xO@testcluster.6f94f5o.mongodb.net/assignment';
// Connect to MongoDB
mongoose
.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
}as ConnectOptions)
.then((db) => {
  console.log("Database Connected Successfuly.");
})
.catch((err) => {
  console.log("Error Connectiong to the Database");
});

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Use task routes
app.use('/api/tasks', taskRoutes);

// MQTT message handler
mqttClient.on('connect', () => {
  mqttClient.subscribe('/add');
});

mqttClient.on('message', async (topic, message) => {
  const newTask = JSON.parse(message.toString());

  // Store the new task in Redis
  const existingTasks = await client.get(redisKey);
  const tasksArray = existingTasks ? JSON.parse(existingTasks) : [];
  tasksArray.push(newTask);
  await client.set(redisKey, JSON.stringify(tasksArray));

  // Check if there are more than 50 items in the cache, and if so, move them to MongoDB
  if (tasksArray.length > 50) {
    const tasksToMove = tasksArray.splice(0, 50);
    await Task.insertMany(tasksToMove.map((task: string) => ({ description: task })));
    await client.set(redisKey, JSON.stringify(tasksArray));
  }
});

// Schedule a task to check and move tasks from Redis to MongoDB
cron.schedule('* * * * *', async () => {
  const tasksArray = await client.get(redisKey);

  if (tasksArray && JSON.parse(tasksArray).length > 50) {
    const tasksToMove = JSON.parse(tasksArray).splice(0, 50);
    await Task.insertMany(tasksToMove.map((task: string) => ({ description: task })));
    await client.set(redisKey, JSON.stringify(tasksArray));
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
