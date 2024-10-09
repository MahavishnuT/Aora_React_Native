import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.tom.aora',
  projectId: '67065e1c0035b9ed6e08',
  databaseId: '67065fd3003024d547b2',
  userCollectionId: '6706600c0021ce6c6435',
  videoCollectionId: '67066049000a0de3fbb0',
  storageId: '670662a10001b18e4339',
};

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


/**
 * Creates a new user in Appwrite.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @param {string} username - The username of the user.
 *
 * @returns {Promise<Document>} The document of the newly created user.
 *
 * @throws {Error} If the creation of the user fails.
 */
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(), // Generate unique ID
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    // Create user in database
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

/**
 * Signs in an existing user to Appwrite.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 *
 * @returns {Promise<Session>} The session object of the user.
 *
 * @throws {Error} If the sign in fails.
 */
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Gets the current user from Appwrite.
 *
 * @returns {Promise<Document>} The document of the current user.
 *
 * @throws {Error} If the user is not logged in or if the request fails.
 */
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )

    if(!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}
