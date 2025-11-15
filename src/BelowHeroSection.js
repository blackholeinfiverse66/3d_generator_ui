import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './BelowHeroSection.css';

const RotatingBox = () => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#6EE7FF"
        wireframe
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

const MiniPreview = ({ modelData }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ alpha: true, antialias: false }}
      dpr={1}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <RotatingBox />
    </Canvas>
  );
};

const FeatureChip = ({ icon, title, description, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="feature-chip"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-describedby={`tooltip-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="chip-icon">{icon}</div>
      <span className="chip-title">{title}</span>
      
      {showTooltip && (
        <div 
          className="chip-tooltip"
          id={`tooltip-${title.replace(/\s+/g, '-').toLowerCase()}`}
          role="tooltip"
        >
          <div className="tooltip-title">{title}</div>
          <div className="tooltip-description">{description}</div>
        </div>
      )}
    </div>
  );
};

const TemplateCarousel = ({ templates, onTemplateSelect, onPreview }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTemplate = () => {
    setCurrentIndex((prev) => (prev + 1) % templates.length);
  };

  const prevTemplate = () => {
    setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length);
  };

  return (
    <div className="template-carousel">
      <button 
        className="carousel-btn prev"
        onClick={prevTemplate}
        aria-label="Previous template"
      >
        ‹
      </button>
      
      <div className="carousel-track">
        {templates.slice(currentIndex, currentIndex + 3).map((template, index) => (
          <div
            key={template.id}
            className="template-thumbnail"
            onClick={() => onTemplateSelect(template)}
            onMouseEnter={() => onPreview(template)}
            role="button"
            tabIndex={0}
            aria-label={`Select template: ${template.name}`}
          >
            <div className="thumbnail-image">
              <div className="thumbnail-icon">{template.icon}</div>
            </div>
            <div className="thumbnail-name">{template.name}</div>
          </div>
        ))}
      </div>
      
      <button 
        className="carousel-btn next"
        onClick={nextTemplate}
        aria-label="Next template"
      >
        ›
      </button>
    </div>
  );
};

const BelowHeroSection = ({ 
  onGenerate, 
  onChooseTemplate, 
  onUploadReference,
  isGenerating,
  lastGenerated 
}) => {
  const [previewModel, setPreviewModel] = useState(null);

  const templates = [
    { id: 1, name: "Gaming Chair", icon: "🪑", type: "chair" },
    { id: 2, name: "Desk Lamp", icon: "💡", type: "lamp" },
    { id: 3, name: "Coffee Table", icon: "🪑", type: "table" },
    { id: 4, name: "Bookshelf", icon: "📚", type: "shelf" },
    { id: 5, name: "Office Desk", icon: "🖥️", type: "desk" }
  ];

  const features = [
    {
      icon: "⚡",
      title: "AI-Powered",
      description: "Advanced machine learning algorithms generate unique 3D designs from your descriptions"
    },
    {
      icon: "👁️",
      title: "Real-time Preview",
      description: "See your designs come to life instantly with interactive 3D visualization"
    },
    {
      icon: "📦",
      title: "Export Ready",
      description: "Download your designs in multiple formats ready for 3D printing or rendering"
    }
  ];

  const handlePreviewTemplate = (template) => {
    setPreviewModel(template);
  };

  const handleOpenPreview = () => {
    // Open full-stage modal with larger 3D view
    console.log('Opening full preview modal');
  };

  return (
    <section className="below-hero-section">
      <div className="section-layout">
        {/* Left: Mini Preview */}
        <div className="mini-preview-container">
          <div 
            className="mini-preview-canvas"
            onClick={handleOpenPreview}
            role="button"
            tabIndex={0}
            aria-label="Open full 3D preview"
          >
            <MiniPreview modelData={previewModel || lastGenerated} />
          </div>
          <div className="preview-label">Live Preview</div>
        </div>

        {/* Center: Content */}
        <div className="center-content">
          <h2 className="section-headline">
            Transform your imagination into stunning 3D designs
          </h2>
          
          <div className="feature-chips">
            {features.map((feature, index) => (
              <FeatureChip
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                onClick={() => console.log(`Feature clicked: ${feature.title}`)}
              />
            ))}
          </div>
          
          <p className="section-microcopy">
            Describe your vision and watch it materialize in seconds
          </p>
        </div>

        {/* Right: CTA Cluster */}
        <div className="cta-cluster">
          <button 
            className="cta-primary"
            onClick={onGenerate}
            disabled={isGenerating}
            aria-label="Generate 3D design"
          >
            {isGenerating ? (
              <>
                <div className="spinner-mini"></div>
                Generating...
              </>
            ) : (
              <>
                ⚡ Generate
              </>
            )}
          </button>
          
          <button 
            className="cta-secondary"
            onClick={onChooseTemplate}
            aria-label="Choose from templates"
          >
            📋 Choose Template
          </button>
          
          <button 
            className="cta-tertiary"
            onClick={onUploadReference}
            aria-label="Upload reference image"
          >
            📎 Upload Reference
          </button>
        </div>
      </div>

      {/* Template Carousel */}
      <div className="carousel-section">
        <h3 className="carousel-title">Popular Templates</h3>
        <TemplateCarousel
          templates={templates}
          onTemplateSelect={onChooseTemplate}
          onPreview={handlePreviewTemplate}
        />
      </div>
    </section>
  );
};

export default BelowHeroSection;