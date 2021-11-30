import { Column } from './column.model';

export class Board {
	constructor(
		public name: string, 
		public description: string,
		public date: Date,
		public columns: Column[],
		public boardId: string) {}
}