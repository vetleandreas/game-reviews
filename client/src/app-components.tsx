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
import gameServices, { CarouselItems, AllGamesItems, GameReviewsItems } from './game-services';
import reviewService from './review-services';

const history = createHashHistory();

export class Navigation extends Component {
  searchQuery = '';
  render() {
    return (
      <>
        <Navbar
          sticky="top"
          collapseOnSelect
          expand="lg"
          bg="dark"
          variant="dark"
          style={{ marginBottom: '100px' }}
        >
          <Container fluid>
            <Navbar.Brand href="/">The game review project</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/#/games/">Games</Nav.Link>
                <Nav.Link href="#">Latest Games</Nav.Link>
              </Nav>
              <Form className="d-flex">
                <FormControl
                  type="search"
                  placeholder="Search games"
                  className="me-2"
                  aria-label="Search games"
                  value={this.searchQuery}
                  onChange={(event) => {
                    this.searchQuery = event.currentTarget.value;
                  }}
                  onKeyDown={(event) => {
                    event.keyCode == 13
                      ? (history.push('/search/' + String(this.searchQuery)), scrollTo(0, 0))
                      : null;
                  }}
                />
                <Button
                  variant="outline-secondary"
                  onClick={(event) => {
                    history.push('/search/' + String(this.searchQuery)), scrollTo(0, 0);
                  }}
                >
                  Search
                </Button>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export class AllGames extends Component {
  games: AllGamesItems[] = [];
  offset = 0;
  render() {
    if (this.games.length == 0) {
      return null;
    }
    return (
      <>
        <Container style={{ minHeight: '500px', marginTop: '55px' }}>
          <Row>
            {console.log(this.games)}
            {this.games[1].result.map((game) => (
              <Card
                key={game.id}
                style={{ width: '320px' }}
                className="card card-cover card-hover overflow-hidden text-white bg-dark rounded-5 shadow-lg"
              >
                <Nav.Link
                  href={'#/game/' + game.slug + '/'}
                  style={{ color: '#fff', padding: 0, margin: 0 }}
                >
                  <Card.Img
                    variant="top"
                    src={String(game.cover.url).replace('t_thumb', 't_logo_med_2x')}
                  />
                  <Card.Body className="text-shadow-1">
                    <Card.Title style={{ fontSize: '18px' }}>{game.name}</Card.Title>
                    {game.genres
                      ? game.genres.map((genres) => (
                          <Badge style={{ marginRight: '5px' }}>{genres.name}</Badge>
                        ))
                      : null}
                  </Card.Body>
                </Nav.Link>
              </Card>
            ))}
          </Row>
          <Row>
            <Col className="d-flex flex-row-reverse">
              <ButtonGroup>
                {this.offset > 0 ? (
                  <Button
                    variant="secondary"
                    onClick={(event) => {
                      if (this.offset > 20) {
                        this.offset = Number(this.offset) - 20;
                      } else {
                        this.offset = 0;
                      }
                      history.push('/games/' + this.offset + '/');
                      window.scrollTo(0, 0);
                    }}
                  >
                    Previous
                  </Button>
                ) : null}
                {console.log(this.games[0].count)}
                {this.games[0].count - 20 > this.offset ? (
                  <Button
                    variant="secondary"
                    onClick={(event) => {
                      if (this.offset < this.games[0].count) {
                        this.offset = Number(this.offset) + 20;
                      } else {
                        this.offset = this.games[0].count;
                      }
                      history.push('/games/' + this.offset + '/');
                      // location.reload(); Kan bruke denne til og laste siden på nytt slik at carousel blir oppdatert med nye slides
                      window.scrollTo(0, 0);
                    }}
                  >
                    Next
                  </Button>
                ) : null}
              </ButtonGroup>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
  mounted() {
    this.offset = this.props.match.params.offset ? this.props.match.params.offset : 0;
    console.log(this.offset);
    gameServices
      .getAllGames(this.offset)
      .then((response) => (this.games = response))
      .catch((error) => console.log(error));
  }
}

export class GetGame extends Component {
  user_id = 123456789123456789;
  upvotes = [];
  gameReview: GameReviewsItems[] = [];
  gameScore = []; // TESTING ONLY
  score = 0;
  gameId = null;
  game = [];
  slug = '';
  errormsg = '';
  empty = setTimeout(() => {
    this.empty = 1;
  }, 2000);
  render() {
    // function to prettify timestamp!
    function dateTime(timestamp) {
      let dt = new Date(timestamp);
      return `${
        (dt.getDay() < 10 ? '0' + dt.getDay() : dt.getDay()) +
        '.' +
        (dt.getMonth() < 10 ? '0' + dt.getMonth() : dt.getMonth()) +
        '.' +
        dt.getFullYear()
      } @${
        (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) +
        ':' +
        (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
      }`;
    }
    if (this.game.length == 0) {
      return null;
    }
    return (
      <>
        <Container
          className="my-3 p-3 bg-dark rounded shadow-sm bg-primaty text-light"
          style={{ zIndex: -999, minHeight: '550px' }}
        >
          {this.game.length == 0 ? (
            <div className="center-div">
              {this.empty != 1 ? (
                <Spinner animation="border" />
              ) : (
                <h3>Error: Could not locate game: {this.props.match.params.slug}</h3>
              )}
            </div>
          ) : null}
          {this.game.map((game: Foo | null) => (
            <Row style={{ zIndex: 999, position: 'relative' }}>
              {game.cover ? (
                <div
                  className="game-hero w-100"
                  style={{
                    opacity: 0.5,
                    backgroundImage: `linear-gradient(to top, rgba(33, 37, 41, 1), rgba(0,0,0,0.70)), url(${String(
                      game.cover.url
                    ).replace('t_thumb', 't_screenshot_big')})`,
                  }}
                ></div>
              ) : null}
              {console.log(game)}
              {game.cover ? (
                <Col sm lg="3" style={{ zIndex: 999 }}>
                  <Figure>
                    <Figure.Image
                      className="img-fluid"
                      alt="171x180"
                      src={String(game.cover.url).replace('t_thumb', 't_cover_big_2x')}
                    />
                  </Figure>
                </Col>
              ) : null}
              <Col style={{ zIndex: 999 }}>
                <Row style={{ zIndex: 999 }}>
                  <Col style={{ zIndex: 999 }}>
                    <h1 className="display-6 .shadow-class">{game.name}</h1>
                    {game.release_dates ? 'Released: ' + game.release_dates[0].human : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p className="lead .shadow-class">{game.summary}</p>
                  </Col>
                </Row>
                {/* Badge for platforms */}
                {game.parent_game ? (
                  <Row style={{ zIndex: 999 }}>
                    <Col>
                      <p>
                        This is an expansion of{' '}
                        <Nav.Link
                          id="expansion-link"
                          href={'#/game/' + game.parent_game.slug + '/'}
                        >
                          {game.parent_game.name}
                        </Nav.Link>
                      </p>
                    </Col>
                  </Row>
                ) : null}
                {/* Start: Game Rating from IGDB*/}
                {game.total_rating ? (
                  <Row style={{ marginBottom: '20px' }}>
                    <Col>
                      <ProgressBar
                        style={{ height: '32px' }}
                        variant={
                          // Nested ternary to get different colours depending on game rating.
                          game.total_rating < 25
                            ? 'danger'
                            : game.total_rating < 50
                            ? 'warning'
                            : game.total_rating < 75
                            ? 'info'
                            : 'success'
                        }
                        now={Math.round(game.total_rating)}
                        label={`IGDB Overall ratings: ${Math.round(game.total_rating)}%`}
                      />
                    </Col>
                  </Row>
                ) : null}
                {/* End: Game Rating from IGDB*/}
                {/* Start review rating */}
                {this.gameScore.length > 0 ? (
                  <ProgressBar
                    style={{ height: '32px' }}
                    variant={
                      // Nested ternary to get different colours depending on game rating.
                      this.gameScore[0]['AVG(score)'].toFixed(2) * 10 < 25
                        ? 'danger'
                        : this.gameScore[0]['AVG(score)'].toFixed(2) * 10 < 50
                        ? 'warning'
                        : this.gameScore[0]['AVG(score)'].toFixed(2) * 10 < 75
                        ? 'info'
                        : 'success'
                    }
                    now={this.gameScore[0]['AVG(score)'].toFixed(2) * 10}
                    label={`Review ratings: ${this.gameScore[0]['AVG(score)'].toFixed(2) * 10}%`}
                  />
                ) : (
                  <p>Rating: No review ratings available for this game.</p>
                )}
                {/* End review rating */}
                {game.platforms ? (
                  <Row>
                    <Col>
                      <strong>Platforms: </strong>
                      {game.platforms.map((platform) => (
                        <Badge
                          bg="warning"
                          text="dark"
                          style={{ marginRight: '5px', marginBottom: '5px' }}
                        >
                          {platform.name}
                        </Badge>
                      ))}
                    </Col>
                  </Row>
                ) : null}
                {/* Badge for Developers */}
                {game.involved_companies ? (
                  <Row>
                    <Col>
                      <strong>Developers / Publishers: </strong>
                      {game.involved_companies.map((company) => (
                        <Badge
                          bg="info"
                          text="dark"
                          style={{ marginRight: '5px', marginBottom: '5px' }}
                        >
                          {company.company.name}
                        </Badge>
                      ))}
                    </Col>
                  </Row>
                ) : null}
                {/* Badge for genres */}
                {game.genres ? (
                  <Row>
                    <Col>
                      <strong>Genres: </strong>
                      {game.genres.map((genre) => (
                        <Badge
                          bg="light"
                          text="dark"
                          style={{ marginRight: '5px', marginBottom: '5px' }}
                        >
                          {genre.name}
                        </Badge>
                      ))}
                    </Col>
                  </Row>
                ) : null}
              </Col>
              <Row>{/* Writing reviews goes here */}</Row>
              <Row style={{ marginLeft: '5px', zIndex: 999 }}>
                {console.log('Gamereviews', this.gameReview)}
                <Col>
                  {this.gameReview.length != 0 ? <h3>Reviews</h3> : null}
                  {this.gameReview.map((review) => (
                    // REVIEWS GOES HERE
                    <Card text="dark" className="card-review ">
                      <Card.Title className="card-title">{review.review_title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted card-subtitle">
                        {dateTime(review.created_at)}
                      </Card.Subtitle>
                      <Card.Subtitle>Rated: {review.score}</Card.Subtitle>
                      <Card.Body>
                        <Card.Text>{review.review_text}</Card.Text>
                        {/* TODO: Add upvote functionality */}
                        {this.upvotes.length > 0 ? (
                          <Button
                            variant="warning"
                            onClick={(event) => {
                              event.currentTarget.disabled = true;
                              // Adds upvote. TODO: Needs to disable Upvotebutton if upvoted.
                              console.log('Upvotes:', review);
                              reviewService
                                .upvoteReview(this.user_id, review.id, 1)
                                .then(
                                  // @ts-ignore
                                  reviewService
                                    .getUpvotes()
                                    .then((results) => (this.upvotes = results))
                                    .catch((error) => console.log(error))
                                ) // history.push('/tasks/' + this.task.id))
                                .catch((error) => console.log(error));
                            }}
                          >
                            <i className="fas fa-thumbs-up"></i>
                            <span>
                              {' '}
                              {
                                this.upvotes.filter((upvote) => upvote.review_id == review.id)
                                  .length
                              }
                            </span>
                          </Button>
                        ) : null}
                      </Card.Body>
                    </Card>
                  ))}
                </Col>
              </Row>
              <Row
                className="d-flex justify-content-start"
                style={{ marginLeft: '5px', zIndex: 999 }}
              >
                {/* Expansion */}
                {game.expansions ? (
                  <h1 className="display-6" style={{ paddingLeft: '2px' }}>
                    Expansions
                  </h1>
                ) : null}
                {game.expansions
                  ? game.expansions.map((expansion) => (
                      <Card className="card-hover" style={{ width: '200px' }}>
                        <Nav.Link
                          href={'#/game/' + expansion.slug + '/'}
                          style={{ color: '#000', padding: 0, margin: 0 }}
                        >
                          {expansion.cover ? (
                            <Card.Img
                              variant="top"
                              src={String(expansion.cover.url).replace('t_thumb', 't_logo_med_2x')}
                            />
                          ) : null}
                          <Card.Body className="text-shadow-1">
                            <Card.Title style={{ fontSize: '14px' }}>{expansion.name}</Card.Title>
                            {/* Badges */}
                          </Card.Body>
                        </Nav.Link>
                      </Card>
                    ))
                  : null}
              </Row>
              {/* Recommended games */}
              <Row
                className="d-flex justify-content-start"
                style={{ marginLeft: '5px', zIndex: 999 }}
              >
                {game.similar_games ? (
                  <h1 className="display-6" style={{ paddingLeft: '2px' }}>
                    Recommended games
                  </h1>
                ) : null}
                {game.similar_games
                  ? game.similar_games.map((similar_game) => (
                      <Card className="card-hover" style={{ width: '200px' }}>
                        <Nav.Link
                          href={'#/game/' + similar_game.slug + '/'}
                          style={{ color: '#000', padding: 0, margin: 0 }}
                        >
                          {similar_game.cover ? (
                            <Card.Img
                              variant="top"
                              src={String(similar_game.cover.url).replace(
                                't_thumb',
                                't_logo_med_2x'
                              )}
                            />
                          ) : null}
                          <Card.Body className="text-shadow-1">
                            <Card.Title style={{ fontSize: '14px' }}>
                              {similar_game.name}
                            </Card.Title>
                            {/* Badges */}
                          </Card.Body>
                          {console.log('Similar game: ', similar_game.cover)}
                        </Nav.Link>
                      </Card>
                    ))
                  : null}
              </Row>
            </Row>
          ))}
        </Container>
      </>
    );
  }
  getUpvote(userId: number, reviewId: number) {
    // Get review upvotes for user. ## Not working
    reviewService
      .getUpvotes(reviewId, userId)
      .then((response) => (this.upvotes = response))
      .catch((error) => console.log(error));
  }
  mounted() {
    this.slug = this.props.match.params.slug ? this.props.match.params.slug : '';
    gameServices
      .getSelectedGame(this.slug)
      .then((response) => {
        this.game = response;
        reviewService
          .gameScores(response[0].id)
          .then((response) => (this.gameScore = response))
          .catch((error) => console.log(error));
        reviewService
          .gameReviews(response[0].id)
          .then((response) => (this.gameReview = response))
          .catch((error) => console.log(error));
      })
      .catch((error) => (this.errormsg = error));
    reviewService
      .getUpvotes()
      .then((results) => (this.upvotes = results))
      .catch((error) => console.log(error));
  }
}

export class MainCarousel extends Component {
  // Bare for og få random carousel items
  offset = Math.floor(Math.random() * 1000);
  games = [];
  render() {
    if (this.games.length == 0) {
      return null;
    }
    return (
      <>
        <Carousel>
          {console.log(this.games)}
          {this.games.map((game) => (
            <Carousel.Item key={game.id}>
              <img
                src={String(game.cover.url).replace('t_thumb', 't_screenshot_huge')}
                className="w-100 img-fluid"
                alt={`${game.name} image.`}
              />
              <Carousel.Caption style={{ paddingBottom: '55px' }}>
                <h1>{game.name}</h1>
                <Button variant="dark">Read more</Button>{' '}
                <Button variant="warning">Review it!</Button>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </>
    );
  }
  mounted() {
    gameServices
      .getCarousel(this.offset)
      .then((response) => (this.games = response))
      .catch((error) => console.log(error));
  }
}

export class MainFooter extends Component {
  render() {
    return (
      <footer
        id="main-footer"
        className="bg-dark text-light d-flex flex-wrap justify-content-between align-items-center py-3 border-top"
      >
        <Container>
          <h4>Footer content goes here</h4>
          <p>Some footer text goes here</p>
        </Container>
      </footer>
    );
  }
}

export class SearchGame extends Component {
  games = [];
  searchQuery = '';
  offset = '';
  errormsg = '';
  render() {
    return (
      <>
        <Container className="my-3 p-3 bg-dark rounded shadow-sm bg-primaty text-light">
          <Row>
            <h1 className="display-5">Search</h1>
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search games"
                className="me-2"
                aria-label="Search games"
                value={this.searchQuery}
                onChange={(event) => {
                  this.searchQuery = event.currentTarget.value;
                }}
                onKeyDown={(event) => {
                  event.keyCode == 13
                    ? (history.push('/search/' + String(this.searchQuery)), scrollTo(0, 0))
                    : null;
                }}
              />
              <Button
                variant="outline-secondary"
                onClick={(event) => {
                  history.push('/search/' + String(this.searchQuery)), scrollTo(0, 0);
                }}
              >
                Search
              </Button>
            </Form>
          </Row>
          {/* <Row className="w-100">
            <Col>{this.searchQuery != '' ? 'Søk: ' + this.searchQuery : null}</Col>
          </Row> */}
          <Row>
            <Col className="w-100">
              {this.games
                ? this.games.map((game) => (
                    <div key={game.id} className="w-100 text-muted pt-3 border-bottom">
                      <Row>
                        <Col className="col col-lg-1">
                          {game.cover ? (
                            <Figure>
                              <Figure.Image
                                className="img-fluid rounded float-start"
                                width={90}
                                height={90}
                                alt="171x180"
                                src={String(game.cover.url)}
                              />
                            </Figure>
                          ) : null}
                        </Col>
                        <Col className="col">
                          <Nav.Link href={'#/game/' + game.slug} className="search-link">
                            {game.name}
                          </Nav.Link>
                          {console.log(game)}
                          <div style={{ display: 'block' }}>
                            {game.genres
                              ? game.genres.map((genre) => (
                                  <Badge
                                    bg="warning"
                                    text="dark"
                                    style={{ marginRight: '5px', marginBottom: '5px' }}
                                  >
                                    {genre.name}
                                  </Badge>
                                ))
                              : null}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))
                : null}
            </Col>
          </Row>
          <Row style={{ paddingTop: '25px' }}>
            <Col className="d-flex justify-content-end">
              <ButtonGroup aria-label="Search navigation">
                {this.offset > 0 ? (
                  <Button
                    variant="secondary"
                    onClick={(event) => {
                      if (this.offset < 20) {
                        this.offset = 0;
                        history.push('/search/' + String(this.searchQuery) + '/' + this.offset),
                          scrollTo(0, 0);
                      } else {
                        this.offset -= 20;
                        history.push('/search/' + String(this.searchQuery) + '/' + this.offset),
                          scrollTo(0, 0);
                      }
                    }}
                  >
                    Previous
                  </Button>
                ) : null}
                {this.games.length >= 20 ? (
                  <Button
                    variant="secondary"
                    onClick={(event) => {
                      this.offset += 20;
                      history.push('/search/' + String(this.searchQuery) + '/' + this.offset),
                        scrollTo(0, 0);
                    }}
                  >
                    Next
                  </Button>
                ) : null}
              </ButtonGroup>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
  mounted() {
    this.offset = this.props.match.params.offset ? Number(this.props.match.params.offset) : 0;
    this.searchQuery = this.props.match.params.query ? this.props.match.params.query : '';
    gameServices
      .searchGame(this.searchQuery, this.offset)
      .then((response) => (this.games = response))
      .catch((error) => (this.errormsg = error));
  }
}

export class GameCarousel extends Component {
  render() {
    return (
      <>
        <Container>
          <Carousel>
            <Carousel.Item>
              <Card style={{ float: 'left' }} className="col-md-3">
                <Card.Img variant="top" src="./backgrounds/carousel_background.jpg" />
                <Card.Body>
                  <Card.Title>Card Title 1</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of the
                    card's content.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
              <Card style={{ float: 'left' }} className="col-md-3">
                <Card.Img variant="top" src="./backgrounds/carousel_background.jpg" />
                <Card.Body>
                  <Card.Title>Card Title 1</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of the
                    card's content.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
              <Card style={{ float: 'left' }} className="col-md-3">
                <Card.Img variant="top" src="./backgrounds/carousel_background.jpg" />
                <Card.Body>
                  <Card.Title>Card Title 1</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of the
                    card's content.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
              <Card style={{ float: 'left' }} className="col-md-3">
                <Card.Img variant="top" src="./backgrounds/carousel_background.jpg" />
                <Card.Body>
                  <Card.Title>Card Title 1</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of the
                    card's content.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            </Carousel.Item>
            <Carousel.Item>
              <Card style={{ float: 'left' }} className="col-md-3">
                <Card.Img variant="top" src="./backgrounds/carousel_background.jpg" />
                <Card.Body>
                  <Card.Title>Card Title 1</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of the
                    card's content.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
              <Card style={{ float: 'left' }} className="col-md-3">
                <Card.Img variant="top" src="./backgrounds/carousel_background.jpg" />
                <Card.Body>
                  <Card.Title>Card Title 1</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of the
                    card's content.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
              <Card style={{ float: 'left' }} className="col-md-3">
                <Card.Img variant="top" src="./backgrounds/carousel_background.jpg" />
                <Card.Body>
                  <Card.Title>Card Title 1</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of the
                    card's content.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
              <Card style={{ float: 'left' }} className="col-md-3">
                <Card.Img variant="top" src="./backgrounds/carousel_background.jpg" />
                <Card.Body>
                  <Card.Title>Card Title 1</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of the
                    card's content.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            </Carousel.Item>
          </Carousel>
        </Container>
      </>
    );
  }
}
