import PropTypes from "prop-types";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const CommonPageHero = ({ title }) => {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="common-page-title">
        <h3 className="page-title">{title}</h3>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="primary-color-border"></div>
    </div>
  );
};

CommonPageHero.propTypes = {
  title: PropTypes.string.isRequired,
};

export default CommonPageHero;
