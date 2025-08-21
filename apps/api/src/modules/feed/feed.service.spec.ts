import { enforceDiversity, scoreVideo } from './feed.service';

describe('scoreVideo', () => {
  it('computes weighted score with freshness', () => {
    const s = scoreVideo({
      avgWatchPct: 0.8,
      rewatchRate: 0.2,
      likeRate: 0.1,
      commentRate: 0.05,
      shareRate: 0.03,
      followAfterView: 0.02,
      notInterestedRate: 0.01,
      freshnessHours: 1,
    });
    expect(s).toBeGreaterThan(0.5);
  });
});

describe('enforceDiversity', () => {
  it('filters consecutive same creators and sounds in window', () => {
    const ids = ['a','b','c','d','e','f'];
    const creators = ['u1','u1','u2','u3','u4','u1'];
    const sounds = [null,'s1','s1','s2','s3','s1'];
    const kept = enforceDiversity(ids, creators, sounds, 2);
    const keptIds = kept.map((i) => ids[i]);
    expect(keptIds).toContain('a');
    expect(keptIds).toContain('c');
    expect(keptIds).not.toContain('b'); // same creator and sound conflict
  });
});
