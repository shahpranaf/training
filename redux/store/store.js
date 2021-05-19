// Create Initial Store
const initialState = {
  user: {
    _id: null,
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    isVerified: false,
    accessToken: null,
  },
  subjects: [],
  courses: [],
  modules: [],
  subscriptions: [],
};

export default initialState;
