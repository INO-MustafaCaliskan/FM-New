// mimetype to media type enum value
const getMediaTypeEnumValue = (fileType) => {
  if (fileType.startsWith('image/')) return 1;
  if (fileType.startsWith('video/')) return 2;
  if (fileType.startsWith('audio/')) return 3;
  return 4;
};

export default getMediaTypeEnumValue;