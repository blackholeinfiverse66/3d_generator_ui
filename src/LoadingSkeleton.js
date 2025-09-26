import React from 'react';

const LoadingSkeleton = ({ type = 'card' }) => {
  const skeletonStyle = {
    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px'
  };

  const keyframes = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;

  if (type === 'input') {
    return (
      <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
        <style>{keyframes}</style>
        <div style={{
          ...skeletonStyle,
          height: '60px',
          width: '100%',
          borderRadius: '50px',
          marginBottom: '20px'
        }} />
      </div>
    );
  }

  if (type === 'results') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', maxWidth: '1000px' }}>
        <style>{keyframes}</style>
        <div style={{
          ...skeletonStyle,
          height: '500px',
          width: '100%',
          borderRadius: '25px'
        }} />
        <div style={{
          ...skeletonStyle,
          height: '500px',
          width: '100%',
          borderRadius: '25px'
        }} />
      </div>
    );
  }

  // Default card skeleton
  return (
    <div style={{ padding: '30px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <style>{keyframes}</style>
      <div style={{
        ...skeletonStyle,
        height: '40px',
        width: '60%',
        marginBottom: '20px'
      }} />
      <div style={{
        ...skeletonStyle,
        height: '20px',
        width: '100%',
        marginBottom: '10px'
      }} />
      <div style={{
        ...skeletonStyle,
        height: '20px',
        width: '80%',
        marginBottom: '10px'
      }} />
      <div style={{
        ...skeletonStyle,
        height: '20px',
        width: '90%'
      }} />
    </div>
  );
};

export default LoadingSkeleton;