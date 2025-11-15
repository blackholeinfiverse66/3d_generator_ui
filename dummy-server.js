const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock design generator
app.post('/generate', (req, res) => {
  const { prompt } = req.body;
  
  // Simulate processing delay
  setTimeout(() => {
    const mockDesign = {
      type: prompt.toLowerCase().includes('chair') ? 'chair' : 
            prompt.toLowerCase().includes('table') ? 'table' : 
            prompt.toLowerCase().includes('lamp') ? 'lamp' : 'furniture',
      style: 'modern',
      material: 'wood',
      dimensions: {
        width: Math.floor(Math.random() * 100) + 50,
        height: Math.floor(Math.random() * 100) + 60,
        depth: Math.floor(Math.random() * 80) + 40
      },
      components: [
        {
          name: 'main_body',
          geometry: 'box',
          position: [0, 0, 0],
          scale: [1, 1, 1],
          color: '#8B4513'
        },
        {
          name: 'detail',
          geometry: 'cylinder',
          position: [0, 0.5, 0],
          scale: [0.8, 0.2, 0.8],
          color: '#654321'
        }
      ],
      colors: {
        primary: '#8B4513',
        secondary: '#654321',
        accent: '#D2691E'
      },
      prompt: prompt
    };
    
    res.json(mockDesign);
  }, 1000);
});

app.listen(PORT, () => {
  console.log(`🚀 Dummy server running on http://localhost:${PORT}`);
});