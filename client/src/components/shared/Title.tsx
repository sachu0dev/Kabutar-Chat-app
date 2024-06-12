import { Helmet } from "react-helmet-async";

function Title({ title = "kabutar", description = "a chat app" }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}

export default Title;
