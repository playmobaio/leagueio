import FirestoreBase from './firestoreBase';
import { IScore } from '../models/iScore';
import { CollectionReference, DocumentData, QuerySnapshot } from '@google-cloud/firestore';

class ScoreCollection extends FirestoreBase {
  static collection = "scores";
  scoreCollection: CollectionReference<DocumentData>;

  constructor() {
    super();
    this.scoreCollection = this.db.collection(ScoreCollection.collection);
  }

  addScore(score: IScore): void {
    this.scoreCollection.add(score);
  }

  async getTopN(n: number): Promise<IScore[]> {
    const scoreQuery: QuerySnapshot<DocumentData> = await this.scoreCollection
      .orderBy('score', 'desc')
      .limit(n)
      .get();
    return scoreQuery.docs.map(x => x.data()) as IScore[];
  }
}

export default ScoreCollection;
