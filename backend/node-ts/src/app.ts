import express from 'express';
import { connectDB } from './config/db';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/users', require('./routes/user.routes'));
app.use('/s3', require('./routes/s3.routes'));
app.use('/files', require('./routes/file.routes'));
app.use('/polly', require('./routes/polly.routes'));
app.use('/rekognition', require('./routes/rekognition.routes'));
app.use('/ia', require('./routes/ia.routes'));
app.use("/translate", require("./routes/translate.routes"))
connectDB().catch((err) => {
  console.error('Database connection error:', err);
  process.exit(1); // Finalizar proceso si la conexión falla
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});