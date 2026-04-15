import React from 'react';

function mockJest() {
  return jest.fn ? jest.fn() : function() {};
}

export const useNavigate = mockJest;

export const Link = function Link(props) {
  return React.createElement('a', { href: props.to }, props.children);
};

export const useParams = function() {
  return {};
};

export const useLocation = function() {
  return { pathname: '/' };
};