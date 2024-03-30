import { useState, useEffect } from "react";

const KEY = "d2c7b4f6";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [IsLoading, SetIsLoading] = useState(false);
  const [error, SetError] = useState("");
  useEffect(
    function () {
      //   callback?.();
      const controller = new AbortController();
      async function FetchData() {
        try {
          SetIsLoading(true);
          SetError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("something went wrong while fetching the data");

          const data = await res.json();
          if (data.Response === "False") throw new Error("movie not found");
          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            SetError("");
            SetError(err.message);
          }
        } finally {
          SetIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        SetError("");
        return;
      }
      //   handleClosemovie();
      FetchData();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, IsLoading, error };
}
