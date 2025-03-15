import { setCategories, setLoading as setCategoryLoading, setError as setCategoryError } from '../redux/slice/categorySlice';

// const BASE_URL = 'http://192.168.245.3:5000/api/';
const BASE_URL = 'http://192.168.245.3:8001/';


export const fetchCategories = () => async (dispatch) => {
  try {
    console.log("fetchCategories called");
    // dispatch(setCategoryLoading());
    const response = await fetch(`${BASE_URL}category/`);
    const data = await response.json();
    console.log("fetched data : ", data.categories);
    dispatch(setCategories(data.categories));
  } catch (error) {
    console.error("Error:", error);
    dispatch(setCategoryError(error.message));
  }
};


