import FirestoreBase from './firestoreBase';
import { IScore } from '../models/iScore';
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
  FieldValue
} from '@google-cloud/firestore';

class ScoreCollection extends FirestoreBase {
  static aggregationCollectionName = "aggregation";
  static scoreCollectionName = "scores";
  scoreCollection: CollectionReference<DocumentData>;
  aggregationCollection: CollectionReference<DocumentData>;

  constructor() {
    super();
    this.scoreCollection = this.db.collection(ScoreCollection.scoreCollectionName);
    this.aggregationCollection = this.db.collection(ScoreCollection.aggregationCollectionName);
  }

  addScore(score: IScore): void {
    this.scoreCollection.add(score);
    this.incrementScoreCount();
  }

  incrementScoreCount(): void {
    const ref = this.aggregationCollection.doc(ScoreCollection.scoreCollectionName);
    ref.update('total', FieldValue.increment(1));
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
