import { describe, it, expect, vi, beforeEach } from 'vitest';
import { firestoreService } from './firestoreService';
import { getDocs, setDoc, query, where, collection, orderBy } from 'firebase/firestore';

// Mock Firebase
vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    collection: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    doc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
}));

vi.mock('../lib/firebase', () => ({
    db: {},
}));

describe('firestoreService', () => {
    const mockUserId = 'test-user-id';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getProjects', () => {
        it('should query projects filtering by userId', async () => {
            (getDocs as any).mockResolvedValue({
                docs: [
                    { data: () => ({ id: '1', name: 'Project 1', userId: mockUserId }) }
                ]
            });

            const projects = await firestoreService.getProjects(mockUserId);

            expect(projects).toHaveLength(1);
            expect(projects[0].userId).toBe(mockUserId);
            expect(where).toHaveBeenCalledWith('userId', '==', mockUserId);
        });
    });

    describe('getSessions', () => {
        it('should query sessions filtering by userId', async () => {
            (getDocs as any).mockResolvedValue({
                docs: [
                    { data: () => ({ id: 's1', startTime: 100, userId: mockUserId }) },
                    { data: () => ({ id: 's2', startTime: 200, userId: mockUserId }) }
                ]
            });

            const sessions = await firestoreService.getSessions(mockUserId);

            expect(where).toHaveBeenCalledWith('userId', '==', mockUserId);
            // Verify sorting
            expect(sessions[0].startTime).toBe(200);
            expect(sessions[1].startTime).toBe(100);
        });
    });
});
