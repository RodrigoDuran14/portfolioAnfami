import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  doc,
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  query,
  orderBy
} from 'firebase/firestore';

// Colecciones en Firestore
const COLLECTIONS = {
  PRODUCTS: 'products',
  CAROUSEL: 'carousel',
  SECTIONS: 'sections',
  CONTACTS: 'contacts'
};

// ============ PRODUCTOS ============
export const getProducts = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.PRODUCTS), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};

export const addProduct = async (product) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (id, updatedData) => {
  try {
    const productRef = doc(db, COLLECTIONS.PRODUCTS, id);
    await updateDoc(productRef, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    });
    return { id, ...updatedData };
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// ============ CARRUSEL ============
export const getCarouselImages = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.CAROUSEL), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      url: doc.data().url 
    }));
  } catch (error) {
    console.error("Error getting carousel images:", error);
    return [];
  }
};

export const addCarouselImage = async (imageUrl) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CAROUSEL), {
      url: imageUrl,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, url: imageUrl };
  } catch (error) {
    console.error("Error adding carousel image:", error);
    throw error;
  }
};

export const deleteCarouselImage = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.CAROUSEL, id));
  } catch (error) {
    console.error("Error deleting carousel image:", error);
    throw error;
  }
};

// ============ SECCIONES DE TEXTO ============
export const getSectionContent = async (sectionName) => {
  try {
    const docRef = doc(db, COLLECTIONS.SECTIONS, sectionName);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error getting section:", error);
    return null;
  }
};

export const updateSectionContent = async (sectionName, content) => {
  try {
    await setDoc(doc(db, COLLECTIONS.SECTIONS, sectionName), {
      content,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating section:", error);
    throw error;
  }
};

// ============ CONTACTOS ============
export const addContact = async (contactData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CONTACTS), {
      ...contactData,
      fecha: new Date().toISOString(),
      leido: false,
      respondido: false
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding contact:", error);
    throw error;
  }
};

export const getContacts = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.CONTACTS), orderBy('fecha', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting contacts:", error);
    return [];
  }
};

export const markContactAsRead = async (contactId) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.CONTACTS, contactId), {
      leido: true
    });
  } catch (error) {
    console.error("Error marking contact as read:", error);
    throw error;
  }
};

export const deleteContact = async (contactId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.CONTACTS, contactId));
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
};