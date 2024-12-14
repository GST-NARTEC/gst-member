export const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    
    const baseUrl = 'https://gs1ksa.org:3093';
    
    // If the URL already starts with http/https, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
  
    // Remove leading double backslashes and replace all double backslashes with forward slashes
    const formattedPath = imageUrl.replace(/^\\+/, '').replace(/\\/g, '/');
    
    // Combine base URL with formatted path
    return `${baseUrl}${formattedPath.startsWith('/') ? '' : '/'}${formattedPath}`;
  };