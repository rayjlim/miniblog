import { ENVIRONMENT } from '../constants';
const showDevRibbon = ENVIRONMENT === 'development';

const DevRibbon = () => {
  return (
    <>
      {/* {showGHCorner && <GithubCorner />} */}
      {
        showDevRibbon && (
          <a
            className="github-fork-ribbon"
            href="#dev"
            data-ribbon="Development"
            title="Development"
          >
            Development
          </a>
        )
      }
    </>
  );
};
export default DevRibbon;
