import React from 'react';
import PropTypes from 'prop-types';

const mockJest = () => (jest.fn ? jest.fn() : function mockFn() {});

export const useNavigate = mockJest;

export const Link = function Link({ to, children }) {
  return React.createElement('a', { href: to }, children);
};

Link.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
};

Link.defaultProps = {
  to: '',
  children: null,
};

export const useParams = () => ({});

export const useLocation = () => ({ pathname: '/' });
