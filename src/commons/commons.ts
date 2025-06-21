// src\commons\commons.ts
import moment from 'moment';

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

  /**
 * Format a duration (in seconds) into a readable HH:mm:ss or mm:ss string.
 * @param totalSeconds - Duration in seconds
 * @returns A string formatted as H:mm:ss or mm:ss
 */
  formatDurationFromSeconds = (totalSeconds: number): string => {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '00:00';

  const duration = moment.duration(totalSeconds, 'seconds');
  const hours = duration.hours();
  const minutes = duration.minutes().toString().padStart(2, '0');
  const seconds = duration.seconds().toString().padStart(2, '0');

  return hours > 0
    ? `${hours}:${minutes}:${seconds}`
    : `${minutes}:${seconds}`;
}
}

const commons = new Commons();

export default commons;