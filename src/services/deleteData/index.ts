import type { IDeleteDataService } from './IDeleteDataService';
import { deleteAllData } from './logic/deleteLogic';

export const deleteDataService: IDeleteDataService = {
  deleteAllData,
};
