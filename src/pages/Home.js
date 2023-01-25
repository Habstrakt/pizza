import React from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategoryId,
  setCurrentPage,
  setFilters,
} from "../redux/slices/filterSlice";
import { useEffect, useState, useRef } from "react";

import Product from "../components/Product";
import ProductSkeleton from "../components/ProductSkeleton";

import Filter, { sortLists } from "../components/Filter";
import Categories from "../components/Categories";
import Pagination from "../components/Pagination";
import { SearchContext } from "../App";

const Home = () => {
  // const categoryId = useSelector((state) => state.filter.categoryId);
  // const sortType = useSelector((state) => state.filter.sort.sortProperty);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const { categoryId, sort, currentPage } = useSelector(
    (state) => state.filter
  );

  const { searchValue } = React.useContext(SearchContext);

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };

  const fetchPizzas = async () => {
    setloadingProduct(true);

    const sortBy = sort.sortProperty.replace("-", "");
    const order = sort.sortProperty.includes("-") ? "asc" : "desc";
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `&search=${searchValue}` : "";

    try {
      const response = await axios.get(
        `https://63b30db9ea89e3e3db3cb777.mockapi.io/items?${category}&sortBy=${sortBy}&order=${order}${search}`
      );
      setItems(response.data);
    } catch (error) {
      setloadingProduct(false);
      console.log(error, "ERROR");
      alert("Ошибка при получении пицц");
    } finally {
      setloadingProduct(false);
    }
  };

  // Если изменили параметры и был первый рендер
  useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
      });
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  // Если был первый рендер, то проверяем URL параметры и сохраняем в редаксе
  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));

      const sort = sortLists.find(
        (obj) => obj.sortProperty === params.sortProperty
      );
      dispatch(
        setFilters({
          ...params,
          sort,
        })
      );

      isSearch.current = true;
    }
  }, []);

  // Если был первый рендер, то запрашиваем пиццы
  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      fetchPizzas();
    }

    isSearch.current = false;
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  const [items, setItems] = useState([]);

  const [loadingProduct, setloadingProduct] = useState(true);

  const pizzas = items.map((pizza) => (
    <Product
      id={pizza.id}
      title={pizza.title}
      price={pizza.price}
      img={pizza.imageUrl}
      sizes={pizza.sizes}
      types={pizza.types}
    />
  ));

  const skeletons = [...new Array(8)].map((_, i) => (
    <ProductSkeleton key={i} />
  ));

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Filter />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {loadingProduct ? skeletons : pizzas}
        {/* <Product {...pizza}/> */}
      </div>
      {/* <Pagination currentPage={currentPage} onChangePage={onChangePage} /> */}
    </div>
  );
};

export default Home;
