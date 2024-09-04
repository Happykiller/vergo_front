import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model';
import { TrainingNormalizedUsecaseModel } from '@usecases/training/model/training.normalized.usecase.model';

export type GridItem = { serie: number; title: string; img: string; ite?: number; weight?: number; description?: string; workout_slug?:string };

export class BuildPreviewItemsUsecase {

  execute(dto: {
    training_normalized: TrainingNormalizedUsecaseModel[],
    exercices: ExerciceUsecaseModel[],
    locale: string
  }): GridItem[]  {
    const itemList: GridItem[] = dto.training_normalized.filter(elt => elt.type === 'effort').map(elt => {
      const exercice = dto.exercices.find(exe => exe.slug === elt.slugs[1]);
      return {
        serie: 1,
        workout_slug: elt.slugs[0],
        title: exercice?.title.find(value => value.lang === dto.locale)?.value??'',
        description: exercice?.description.find(value => value.lang === dto.locale)?.value??'',
        img: exercice?.image??'not_found',
        duration: elt.duration,
        ite: elt.ite,
        weight: elt.weight
      }
    });

    const groupedItems: GridItem[] = [];

    itemList.forEach((item, index) => {
      // Si c'est le premier élément, on l'ajoute directement
      if (index === 0) {
        groupedItems.push({ ...item });
      } else {
        const previousItem = groupedItems[groupedItems.length - 1];
    
        // Comparer le titre avec le précédent
        if (this.shallowEqual(item, previousItem)) {
          // Si le titre est le même que le précédent, on incrémente la série
          previousItem.serie += 1;
        } else {
          // Si le titre est différent, on commence un nouveau groupe
          groupedItems.push({ ...item });
        }
      }
    });

    return groupedItems;
  }

  shallowEqual(obj1:any, obj2:any) {
    const keys1 = Object.keys(obj1).filter(key => key !== 'serie');
    const keys2 = Object.keys(obj2).filter(key => key !== 'serie');
  
    // Comparer le nombre de propriétés
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    // Comparer les valeurs des propriétés
    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
  
    return true;
  }
}