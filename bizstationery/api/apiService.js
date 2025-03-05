import { setCategories, setLoading as setCategoryLoading, setError as setCategoryError } from '../redux/slice/categorySlice';

const BASE_URL = 'http://192.168.43.3:5000/api/';

export const fetchCategories = () => async (dispatch) => {
  try {
    console.log("fetchCategories called");
    // dispatch(setCategoryLoading());
    const response = await fetch(`${BASE_URL}category`);
    const data = await response.json();
    console.log("fetched data : ", data);
    dispatch(setCategories(data));
  } catch (error) {
    console.error("Error:", error);
    dispatch(setCategoryError(error.message));
  }
};


