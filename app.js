import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import patientRoutes from './api/routes/patients.route.js';
import professionalRoutes from './api/routes/professionals.route.js';
import appointmentsRoutes from './api/routes/appointments.route.js';
import authRoutes from './api/routes/auth.route.js';
import userRoutes from './api/routes/users.route.js';
import emailRoutes from './api/routes/email.route.js';

const app = express();

// Middleware para CORS (permite todas las solicitudes)
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Usar la arquitectura MVC
app.use('/api', patientRoutes);
app.use('/api', professionalRoutes);
app.use('/api', appointmentsRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', emailRoutes);

// Conexión a MongoDB Atlas usando variables de entorno
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));
}

// Endpoints de test
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.get('/ping', (req, res) => {
  res.json({ message: 'direct ping works', env: process.env.NODE_ENV });
});

app.get('/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods),
      });
    }
  });
  res.json({ routes, env: process.env.NODE_ENV });
});

export default app;
// Remover el handler de aquí - ahora está en handler.js
