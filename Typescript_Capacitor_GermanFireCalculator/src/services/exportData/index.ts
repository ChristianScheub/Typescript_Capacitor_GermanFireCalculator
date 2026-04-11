import type { IExportDataService } from './IExportDataService';
import { exportFireState } from './logic/exportLogic';

export const exportDataService: IExportDataService = {
  exportFireState,
};
