export class Commons {
  getTimestampFromObjectId = (objectId:string) => {
    // Les premiers 8 caractères (4 octets) de l'ObjectId représentent le timestamp en hexadécimal
    const timestampHex = objectId.toString().substring(0, 8);
    
    // Convertir le timestamp hexadécimal en nombre de secondes
    const timestamp = parseInt(timestampHex, 16);
    
    // Convertir le timestamp en date
    const date = new Date(timestamp * 1000);
    
    return date;
  }
}

const commons = new Commons();

export default commons;