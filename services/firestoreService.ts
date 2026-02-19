import { collection, getDocs, setDoc, doc, deleteDoc, query, orderBy, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Project, Session } from "../types";

const PROJECTS_COLLECTION = "projects";
const SESSIONS_COLLECTION = "sessions";

export const firestoreService = {
    // Projects
    async getProjects(userId: string): Promise<Project[]> {
        const q = query(collection(db, PROJECTS_COLLECTION), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Project);
    },

    async saveProject(project: Project): Promise<void> {
        await setDoc(doc(db, PROJECTS_COLLECTION, project.id), project);
    },

    async deleteProject(projectId: string): Promise<void> {
        await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
    },

    // Sessions
    async getSessions(userId: string): Promise<Session[]> {
        const q = query(
            collection(db, SESSIONS_COLLECTION),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs
            .map(doc => doc.data() as Session)
            .sort((a, b) => b.startTime - a.startTime);
    },

    async saveSession(session: Session): Promise<void> {
        await setDoc(doc(db, SESSIONS_COLLECTION, session.id), session);
    },

    async deleteSession(sessionId: string): Promise<void> {
        await deleteDoc(doc(db, SESSIONS_COLLECTION, sessionId));
    }
};
