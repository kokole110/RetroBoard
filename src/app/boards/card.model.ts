import { Comment } from './comment.model';

export class Card {
	constructor (
		public cardId: string,
		public text: string, 
		public creatorName: string,
		public likeCount: number,
		public likedBy: string[],
		public allowEdit: boolean,
		public comments: Comment[]
		) {}
}