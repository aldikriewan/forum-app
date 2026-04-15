import React from 'react';

export const useNavigate = () => jest.fn();

export const Link = ({ children, to }) => <a href={to}>{children}</a>;

export const useParams = () => ({});

export const useLocation = () => ({ pathname: '/' });