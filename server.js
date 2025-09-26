const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy data for different prompts
const dummyResponses = {
  default: {
    "type": "chair",
    "style": "modern",
    "material": "wood",
    "dimensions": {
      "width": 50,
      "height": 80,
      "depth": 45
    },
    "components": [
      {
        "name": "seat",
        "shape": "rectangle",
        "position": [0, 40, 0],
        "size": [45, 5, 40]
      },
      {
        "name": "backrest",
        "shape": "rectangle",
        "position": [0, 60, -15],
        "size": [40, 35, 3]
      },
      {
        "name": "legs",
        "shape": "cylinder",
        "position": [-20, 20, -17.5],
        "size": [3, 40, 3]
      },
      {
        "name": "legs",
        "shape": "cylinder",
        "position": [20, 20, -17.5],
        "size": [3, 40, 3]
      },
      {
        "name": "legs",
        "shape": "cylinder",
        "position": [-20, 20, 17.5],
        "size": [3, 40, 3]
      },
      {
        "name": "legs",
        "shape": "cylinder",
        "position": [20, 20, 17.5],
        "size": [3, 40, 3]
      }
    ],
    "colors": {
      "primary": "#8B4513",
      "secondary": "#654321"
    }
  },

  table: {
    "type": "table",
    "style": "dining",
    "material": "wood",
    "dimensions": {
      "width": 120,
      "height": 75,
      "depth": 80
    },
    "components": [
      {
        "name": "tabletop",
        "shape": "rectangle",
        "position": [0, 35, 0],
        "size": [120, 5, 80]
      },
      {
        "name": "legs",
        "shape": "cylinder",
        "position": [-50, 17.5, -30],
        "size": [4, 35, 4]
      },
      {
        "name": "legs",
        "shape": "cylinder",
        "position": [50, 17.5, -30],
        "size": [4, 35, 4]
      },
      {
        "name": "legs",
        "shape": "cylinder",
        "position": [-50, 17.5, 30],
        "size": [4, 35, 4]
      },
      {
        "name": "legs",
        "shape": "cylinder",
        "position": [50, 17.5, 30],
        "size": [4, 35, 4]
      }
    ],
    "colors": {
      "primary": "#8B4513",
      "secondary": "#A0522D"
    }
  },

  lamp: {
    "type": "lamp",
    "style": "modern",
    "material": "metal",
    "dimensions": {
      "width": 20,
      "height": 150,
      "depth": 20
    },
    "components": [
      {
        "name": "base",
        "shape": "cylinder",
        "position": [0, 10, 0],
        "size": [15, 20, 15]
      },
      {
        "name": "pole",
        "shape": "cylinder",
        "position": [0, 60, 0],
        "size": [2, 100, 2]
      },
      {
        "name": "shade",
        "shape": "cone",
        "position": [0, 120, 0],
        "size": [25, 30, 25]
      }
    ],
    "colors": {
      "primary": "#C0C0C0",
      "secondary": "#FFFFFF"
    }
  }
};

// Generate endpoint
app.post('/generate', (req, res) => {
  const { prompt } = req.body;

  console.log('Received prompt:', prompt);

  // Simple keyword matching to return different responses
  let response = dummyResponses.default;

  const promptLower = prompt.toLowerCase();
  if (promptLower.includes('table')) {
    response = dummyResponses.table;
  } else if (promptLower.includes('lamp') || promptLower.includes('light')) {
    response = dummyResponses.lamp;
  }

  // Add some randomness to make it feel dynamic
  response.id = Date.now();
  response.prompt = prompt;

  setTimeout(() => {
    res.json(response);
  }, 1000 + Math.random() * 2000); // Simulate processing time
});

// Evaluate endpoint
app.post('/evaluate', (req, res) => {
  const { designId, rating } = req.body;

  console.log('Received evaluation:', { designId, rating });

  res.json({
    success: true,
    feedback: `Thank you for rating ${rating} stars!`,
    nextIteration: {
      ...dummyResponses.default,
      id: Date.now() + 1,
      iteration: 2,
      improvements: ["Enhanced ergonomics", "Better material choice", "Refined aesthetics"]
    }
  });
});

// Iterate endpoint
app.post('/iterate', (req, res) => {
  const { designId, feedback } = req.body;

  console.log('Received iteration request:', { designId, feedback });

  res.json({
    ...dummyResponses.default,
    id: Date.now() + 2,
    iteration: 3,
    prompt: feedback || "Improved version based on feedback",
    improvements: ["User feedback incorporated", "Design optimized", "Quality enhanced"]
  });
});

// Stub endpoint for assets
app.get('/stub/generate', (req, res) => {
  res.json({
    assets: [
      { type: 'model', url: '/models/chair.glb' },
      { type: 'texture', url: '/textures/wood.jpg' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Dummy backend server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('POST /generate - Generate design from prompt');
  console.log('POST /evaluate - Rate a design');
  console.log('POST /iterate - Create improved iteration');
  console.log('GET /stub/generate - Get stub assets');
});