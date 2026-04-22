import { seedIfEmpty } from '../db/seed';
import { db } from '../db/client';

jest.mock('../db/client', () => ({
  db: { select: jest.fn(), insert: jest.fn() },
}));

const mockDb = db as unknown as { select: jest.Mock; insert: jest.Mock };

describe('seedIfEmpty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts categories, trips, activities and targets when all tables are empty', async () => {
    const mockValues = jest.fn().mockResolvedValue(undefined);
    const mockFrom = jest.fn().mockResolvedValue([]);
    mockDb.select.mockReturnValue({ from: mockFrom });
    mockDb.insert.mockReturnValue({ values: mockValues });

    await seedIfEmpty();

    expect(mockDb.insert).toHaveBeenCalledTimes(4);
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: 'Outdoor' })])
    );
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: 'Tokyo Explorer' })])
    );
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: 'Senso-ji Temple Visit' })])
    );
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ type: 'weekly' })])
    );
  });

  it('does nothing when data already exists', async () => {
    const mockFrom = jest.fn().mockResolvedValue([{ id: 1, name: 'Outdoor', colour: '#0F766E' }]);
    mockDb.select.mockReturnValue({ from: mockFrom });

    await seedIfEmpty();

    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});
