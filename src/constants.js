// Application Constants
export const CONSTANTS = {
  // Timing
  TYPING_TIMEOUT: 1000,
  ITERATION_DELAY: 1500,
  POLL_INTERVAL: 2000,
  THEME_REFLOW_DELAY: 0,
  FEEDBACK_HIDE_DELAY: 2000,
  
  // Limits
  MAX_POLL_ATTEMPTS: 30,
  MAX_PROMPT_LENGTH: 500,
  PROMPT_WARNING_THRESHOLD: 0.9,
  MAX_TEXTAREA_HEIGHT: 120,
  
  // Notification Durations
  NOTIFICATION_SHORT: 3000,
  NOTIFICATION_MEDIUM: 4000,
  NOTIFICATION_LONG: 5000,
  
  // 3D Configuration
  DONUT_OBJECT_COUNT: 16,
  DONUT_MAJOR_RADIUS: 120,
  DONUT_MINOR_RADIUS: 0,
  MOBILE_BREAKPOINT: 768,
  
  // Animation
  TYPING_CHAR_DELAY: 50,
  SUGGESTION_DISPLAY_TIME: 2000,
  
  // Storage Keys
  STORAGE_KEYS: {
    SAVED_DESIGNS: 'savedDesigns',
    HAS_VISITED: 'hasVisited',
    THEME: 'theme'
  },
  
  // Default Values
  DEFAULTS: {
    THEME: 'dark',
    USER_ID: 'user_123',
    PROJECT_ID: 'proj_001',
    LIGHTING_PRESET: 'studio',
    ZOOM_LEVEL: 100
  },
  
  // Error Messages
  ERRORS: {
    NO_DESIGN_TO_SAVE: 'Please generate a design first before saving.',
    NO_DESIGN_TO_EXPORT: 'Please generate a design first before exporting.',
    SAVE_FAILED: 'Unable to save the design. Storage may be full.',
    EXPORT_FAILED: 'Unable to export the design. Please try again.',
    GENERATION_CANCELLED: 'Design generation was cancelled.',
    PREVIEW_FAILED: 'Unable to generate preview. Please try again.',
    GLB_NOT_FOUND: 'GLB file not found on server',
    GLB_CORS_BLOCKED: 'GLB file blocked by security policy',
    GLB_INVALID_FORMAT: 'GLB file format is invalid',
    GLB_LOAD_FAILED: 'Failed to load 3D model. Please try again.',
    GLB_LOADER_INIT_FAILED: 'Unable to initialize 3D model loader',
    THREE_JS_UNAVAILABLE: 'Three.js dependencies not available'
  },
  
  // Success Messages
  SUCCESS: {
    DESIGN_SAVED: 'Design Saved Successfully!',
    DESIGN_EXPORTED: 'Design Exported!',
    FEEDBACK_SUBMITTED: 'Feedback Submitted',
    DESIGN_IMPROVED: 'Design Improved',
    MATERIAL_UPDATED: 'Material Updated',
    PREVIEW_READY: 'Preview Ready',
    DESIGN_LOADED: 'Design Loaded'
  }
};

// Error Handler Utility
export const handleError = (error, context = 'Unknown') => {
  console.error(`[${context}] Error:`, error);
  return {
    message: error.message || 'An unexpected error occurred',
    context,
    timestamp: new Date().toISOString()
  };
};

// Notification Helper
export const createNotification = (type, title, message, duration = CONSTANTS.NOTIFICATION_SHORT) => ({
  type,
  title,
  message,
  duration
});