import * as React from 'react';
import { Component } from 'react-simplified';
import { createHashHistory } from 'history';
import {
  Container,
  Button,
  Form,
  FormControl,
  Nav,
  Navbar,
  Carousel,
  Card,
  Row,
  Badge,
  Pagination,
  Col,
  ButtonGroup,
  Figure,
  Modal,
  ProgressBar,
  Spinner,
  Accordion,
  Dropdown,
  ListGroup,
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { tsMethodSignature } from '@babel/types';
// @ts-ignore - Ignores error that it can't loate node moule.
import ShareButton from 'react-web-share-button';
import gameServices, {
  CarouselItems,
  AllGamesItems,
  GameReviewsItems,
  ReviewEditItems,
  ReviewUpvoteItems,
} from '../src/game-services';
import reviewService from '../src/review-services';

// Jest Mock
jest.mock('../src/review-service', () => {
  class ReviewService {
    gameReviews() {} // ReviewService get (getall?)
  }
});

describe('');
