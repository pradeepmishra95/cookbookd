import request from '@/services/api/request';
import {useCallback, useMemo, useState} from 'react';

const Defaults = {
  PAGE_NO: 1,
  LIMIT: 10,
};

type usePaginatedRequestPropsType<T> = {
  requestParams: Parameters<typeof request>;
  initialState: Array<T>;
};

const usePaginatedRequest = <T>({
  requestParams,
  initialState,
}: usePaginatedRequestPropsType<T>) => {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(-1);

  const getRequestConfig = useCallback(
    (page: number) => {
      const params = JSON.parse(JSON.stringify(requestParams)) as Parameters<
        typeof request
      >;
      params.splice(2, 1, {
        ...((params.at(2) ?? {}) as Parameters<typeof request>[2]),
        page,
        limit: Defaults.LIMIT,
      });
      return params;
    },
    [requestParams],
  );

  const endReached = useMemo(() => {
    return page === -1;
  }, [page]);

  const getResponse = useCallback(
    async (page: number) => {
      if (!loading) {
        setLoading(true);
        const {
          data: responseData,
          status,
          HttpStatusCode,
        } = await request<Array<T>>(...getRequestConfig(page));
        if (status === HttpStatusCode.OK && responseData.success) {
          if (responseData.data.length > 0) {
            if (page === Defaults.PAGE_NO) {
              setData(responseData.data);
            } else {
              setData(data.concat(responseData.data));
            }

            if (responseData.data.length < Defaults.LIMIT) {
              setPage(-1);
            } else {
              setPage(page);
            }
          } else {
            setPage(-1);
          }
        }
        setLoading(false);
      }
    },
    [loading, getRequestConfig],
  );

  const fetchNextPage = useCallback(async () => {
    if (!endReached) getResponse(page + 1);
    console.log({endReached});
  }, [endReached, page, getResponse]);

  const resetData = useCallback(() => {
    setData([]);
    setPage(Defaults.PAGE_NO);
  }, []);

  const fetchFirstPage = useCallback(async () => {
    getResponse(Defaults.PAGE_NO);
  }, [getResponse]);

  return {
    data,
    fetchNextPage,
    endReached,
    loading,
    fetchFirstPage,
    resetData,
    setData,
  };
};

export default usePaginatedRequest;
