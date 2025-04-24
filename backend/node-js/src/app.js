const express = require('express');
const { connectDB } = require('./config/db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/users", require("./routes/user.routes"));
app.use("/s3", require("./routes/s3.routes"));
app.use("/files", require("./routes/file.routes"));
app.use("/polly", require("./routes/polly.routes"))
app.use("/rekognition", require("./routes/rekognition.routes"))
app.use("/translate", require("./routes/translate.routes"))
app.use("/ia", require("./routes/ia.routes"))

connectDB().catch((err) => {
  console.error('Database connection error:', err);
  process.exit(1); 
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
