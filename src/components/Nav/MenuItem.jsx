import { isArray } from "lodash";
import React, { useState } from "react";
import classNames from "classnames";
import TextAnimation from "../TextAnimation/TextAnimation";
import { useAuth } from "../../contexts/AuthContext";

export default function MenuItem({ props }) {
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthenticated, hasRole } = useAuth();

  const showsubnav = () => {
    setShowMenu(!showMenu);
  };

  const showActive = classNames("ak-munu_dropdown_toggle", {
    active: showMenu,
  });

  const showActivePrent = classNames("menu-item-has-children", {
    active: showMenu,
  });

  // Filter children based on authentication and role requirements
  const getFilteredChildren = () => {
    if (!isArray(props.childern)) return [];
    
    return props.childern.filter(child => {
      // If item requires authentication and user is not authenticated, hide it
      if (child.requiresAuth && !isAuthenticated()) {
        return false;
      }
      
      // If item requires admin role and user doesn't have it, hide it
      if (child.requiresAdmin && !hasRole('admin')) {
        return false;
      }
      
      return true;
    });
  };

  const filteredChildren = getFilteredChildren();

  return (
    <li className={showActivePrent}>
      <TextAnimation link={props.link} title={props.title} />
      {filteredChildren.length > 0 && (
        <>
          <ul>
            {filteredChildren.map((child) => (
              <li key={child.key}>
                <TextAnimation link={child.link} title={child.title} />
              </li>
            ))}
          </ul>
          <span className={showActive} onClick={showsubnav}></span>
        </>
      )}
    </li>
  );
}
