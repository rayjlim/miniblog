
const SearchAggregate = ({searchParams}: any) =>{
  console.log(searchParams);
  return (
    <div className="search-param-description">
    {searchParams !== null
      ? (
        <>
          Date:
          {' '}
          {searchParams.startDate !== '' ? searchParams.startDate : 'Beginning'}
          {' '}
          to
          {' '}
          {searchParams.endDate !== '' ? searchParams.endDate : 'Now'}
          , Limit:
          {' '}
          {searchParams.resultsLimit}
          . Found
          {' '}
          {searchParams.postsCount}
        </>
      )
      : (<>No Search Params</>)}
  </div>
  );
};

export default SearchAggregate;
