import { Web3Storage, File } from 'web3.storage';

// Initialize Web3Storage with the API token
function getAccessToken() {
  return process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

/**
 * Uploads a file to IPFS via Web3.Storage
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - The IPFS hash of the uploaded file
 */
export async function uploadToIPFS(file: File): Promise<string> {
  // Validate file size (max 100MB)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds maximum limit of 100MB');
  }

  const client = makeStorageClient();
  
  try {
    // Upload the file
    const cid = await client.put([file], {
      name: file.name,
      maxRetries: 3,
    });
    
    return cid;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

/**
 * Constructs the IPFS gateway URL for a given CID
 * @param {string} cid - The IPFS content identifier
 * @returns {string} - The gateway URL
 */
export function getIPFSGatewayUrl(cid: string): string {
  return `https://ipfs.io/ipfs/${cid}`;
}

/**
 * Fetches file data from IPFS
 * @param {string} cid - The IPFS content identifier
 * @returns {Promise<Response>} - The file data
 */
export async function getFromIPFS(cid: string): Promise<Response> {
  const url = getIPFSGatewayUrl(cid);
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch file from IPFS: ${response.statusText}`);
  }
  
  return response;
}

/**
 * Gets the MIME type of a file from its extension
 * @param {string} filename - The name of the file
 * @returns {string} - The MIME type
 */
export function getMimeType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    
    // Text
    txt: 'text/plain',
    csv: 'text/csv',
    json: 'application/json',
    
    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    
    // Default
    default: 'application/octet-stream',
  };
  
  return mimeTypes[extension] || mimeTypes.default;
}

/**
 * Creates a downloadable link for a file
 * @param {string} cid - The IPFS content identifier
 * @param {string} filename - The name of the file
 * @returns {string} - The download URL
 */
export function getDownloadUrl(cid: string, filename: string): string {
  return `https://ipfs.io/ipfs/${cid}?filename=${encodeURIComponent(filename)}`;
}
