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

  // Fonction sleep qui retourne une promesse résolue après un certain délai
  sleep = (s: number) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
  };

  // Fonction pour normaliser les chaînes (supprimer les accents et rendre insensible à la casse)
  normalizeString = (str: string) => {
    return str
      .toLowerCase() // Mettre en minuscule
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9]/g, ''); // Supprimer les caractères spéciaux
  };
}

const commons = new Commons();

export default commons;