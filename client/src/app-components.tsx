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
} from './game-services';
import reviewService from './review-services';

const history = createHashHistory();
export class Navigation extends Component {
  searchQuery: string = '';
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
            <Navbar.Brand href="/">Game Review Service </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/#/games/">Games</Nav.Link>
                <Nav.Link href="/#/addgames/">Add game</Nav.Link>
                <Nav.Link href="/#/search/">Search</Nav.Link>
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

// Workaroud for this.props.match.params.offset problem: property 'match' does not exist on type Readonly
export class AllGames extends Component<any> {
  games: AllGamesItems[] = [];
  offset: number = 0;
  render() {
    if (this.games.length == 0) {
      return null;
    }
    return (
      <>
        <Container
          className="my-3 p-3 bg-dark rounded shadow-sm bg-primaty text-light"
          style={{ minHeight: '500px', marginTop: '55px' }}
        >
          {' '}
          <h1 className="display-5">Most recent video games </h1>
          <Row>
            {this.games[1].result.map((game: AllGamesItems) => (
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
                      ? game.genres.map((genres: AllGamesItems) => (
                          <Badge key={genres.id} style={{ marginRight: '5px' }}>
                            {genres.name}
                          </Badge>
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
    gameServices
      .getAllGames(this.offset)
      .then((response) => (this.games = response))
      .catch();
  }
}

// Workaroud for this.props.match.params.offset problem: property 'match' does not exist on type Readonly
export class GetGame extends Component<any> {
  showModal = false;

  // @ts-ignore
  reviewEdit: ReviewEditItems = {};
  user_id = 123456789123456789; // Placeholder usr_id due to no user login. To be used for upvotes only.
  upvotes = [];
  gameReview: GameReviewsItems[] | any = [];
  gameScore: any = [];
  score = 0;
  gameId = null;
  game: GameReviewsItems[] = [];
  slug: string = '';
  errormsg: string = '';
  reviewEditError: string = '';
  formName: string = '';
  formTitle: string = '';
  formEmail: string = '';
  formPassword: string = '';
  formSelect: number = 0;
  formReviewText: string = '';
  render() {
    // function to prettify timestamp!
    function dateTime(timestamp: any) {
      let dt = new Date(timestamp);
      return `${
        (dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()) +
        '.' +
        (dt.getMonth() < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1) +
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
          {this.game.map((game: GameReviewsItems) => (
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
                      // TS error, no clear fix for this issue.
                      // @ts-ignore - type error for JavaScript function .toFixed(2)
                      this.gameScore[0]['AVG(score)'].toFixed(2) * 10 < 25
                        ? 'danger'
                        : // @ts-ignore - type error for JavaScript function .toFixed(2)
                        this.gameScore[0]['AVG(score)'].toFixed(2) * 10 < 50
                        ? 'warning'
                        : // @ts-ignore - type error for JavaScript function .toFixed(2)
                        this.gameScore[0]['AVG(score)'].toFixed(2) * 10 < 75
                        ? 'info'
                        : 'success'
                    }
                    // @ts-ignore
                    now={(this.gameScore[0]['AVG(score)'] * 10).toFixed(2)}
                    label={`Review ratings: ${(this.gameScore[0]['AVG(score)'] * 10).toFixed(2)}%`}
                  />
                ) : (
                  <p>Rating: No review ratings available for this game.</p>
                )}
                {/* End review rating */}
                {game.platforms ? (
                  <Row>
                    <Col>
                      <strong>Platforms: </strong>
                      {game.platforms.map((platform: GameReviewsItems) => (
                        <Badge
                          key={platform.id}
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
                      {game.involved_companies.map((company: GameReviewsItems) => (
                        <Badge
                          key={company.id}
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
                      {game.genres.map((genre: GameReviewsItems) => (
                        <Badge
                          key={genre.id}
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
              {/* START REVIEW FORM */}
              <Container style={{ zIndex: 999 }} className="border-bottom pb-5 my-5">
                <Accordion className="bg-dark">
                  <Accordion.Item className="bg-dark" eventKey="0">
                    <Accordion.Header>
                      <h5>Write your review here!</h5>
                    </Accordion.Header>
                    <Accordion.Body>
                      <h3>Write a review of this game</h3>
                      <Form id="ReviewForm">
                        <Form.Group className="mb-3" controlId="formReviewTitle">
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            placeholder="Enter review title"
                            required
                            value={this.formTitle}
                            onChange={(event) => (this.formTitle = event.currentTarget.value)}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formReviewName">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            placeholder="Enter your name"
                            required
                            value={this.formName}
                            onChange={(event) => (this.formName = event.currentTarget.value)}
                          />
                        </Form.Group>

                        <Row>
                          <Col>
                            <Form.Group className="mb-3" controlId="formReviewEmail">
                              <Form.Label>Email address</Form.Label>
                              <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={this.formEmail}
                                onChange={(event) => (this.formEmail = event.currentTarget.value)}
                              />
                              <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                              </Form.Text>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3" controlId="formReviewPassword">
                              <Form.Label>Password</Form.Label>
                              <Form.Control
                                type="password"
                                placeholder="Password"
                                required
                                value={this.formPassword}
                                onChange={(event) =>
                                  (this.formPassword = event.currentTarget.value)
                                }
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Select
                          className="me-sm-2"
                          id="inlineFormCustomSelect"
                          required
                          value={this.formSelect}
                          onChange={(event) =>
                            (this.formSelect = Number(event.currentTarget.value))
                          }
                        >
                          <option value="0">Select rating</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                        </Form.Select>
                        <Form.Group className="mb-3" controlId="formReviewReviewText">
                          <Form.Label>Example textarea</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={this.formReviewText}
                            onChange={(event) => (this.formReviewText = event.currentTarget.value)}
                            required
                          />
                        </Form.Group>
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={
                            !this.formTitle ||
                            !this.formName ||
                            !this.formEmail ||
                            !this.formPassword ||
                            !this.formSelect ||
                            !this.formReviewText
                          }
                          onClick={(event) => {
                            event.preventDefault();
                            reviewService
                              .postReview(
                                this.formTitle,
                                this.formName,
                                this.formReviewText,
                                this.formEmail,
                                this.game[0].id,
                                this.formSelect,
                                this.formPassword
                              )
                              .then(() => location.reload())
                              .catch(() => null);
                            event.currentTarget.disabled = true;
                          }}
                        >
                          Submit review
                        </Button>
                      </Form>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Container>
              {/* END REVIEW FORM */}
              <Row style={{ marginLeft: '5px', zIndex: 999 }}>
                <Col>
                  <h3>Reviews</h3>
                  {this.gameReview.length == 0 ? (
                    <p>There are no reviews right now. Write one yourself! </p>
                  ) : null}
                  {this.gameReview.map((review: GameReviewsItems) => (
                    <>
                      <Card text="dark" className="card-review" key={review.id}>
                        <Card.Title className="card-title">{review.review_title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted card-subtitle">
                          Created by: {review.review_name} - {dateTime(review.created_at)}{' '}
                        </Card.Subtitle>
                        <Card.Subtitle>Rated: {review.score}</Card.Subtitle>
                        <Card.Body>
                          <Card.Text>{review.review_text}</Card.Text>
                          {/* TODO: Add upvote functionality */}
                          {this.upvotes.length >= 0 ? (
                            <Button
                              variant="warning"
                              onClick={(event) => {
                                event.currentTarget.disabled = true;
                                reviewService
                                  .upvoteReview(this.user_id, review.id, 1)
                                  .then(
                                    // @ts-ignore
                                    reviewService
                                      .getUpvotes()
                                      .then((results) => (this.upvotes = results))
                                      .catch(() => null)
                                  )
                                  .catch(() => null);
                              }}
                            >
                              <i className="fas fa-thumbs-up"></i>
                              <span>
                                {' '}
                                {
                                  this.upvotes.filter(
                                    (upvote: ReviewUpvoteItems) => upvote.review_id == review.id
                                  ).length
                                }
                              </span>
                            </Button>
                          ) : null}{' '}
                          <div
                            id="share-btn-container"
                            className="btn share-btn btn-share btn-success"
                          >
                            <ShareButton
                              className="share-btn btn-share btn-success"
                              buttonText="Share review"
                              variant="success"
                              url={window.location.href}
                            />
                          </div>
                          <Button
                            variant="dark"
                            style={{ float: 'right' }}
                            onClick={(event) => {
                              this.showModal = !this.showModal;
                              this.reviewEditError = '';
                              this.reviewEdit = {
                                review_id: review.id,
                                review_title: review.review_title,
                                // created_by_id: review.created_by_id,
                                created_by_id: '',
                                review_score: review.score,
                                review_text: review.review_text,
                                review_gameid: this.game[0].id,
                                review_password: '',
                              };
                            }}
                          >
                            Edit
                          </Button>{' '}
                        </Card.Body>
                      </Card>
                    </>
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
                  ? game.expansions.map((expansion: GameReviewsItems) => (
                      <Card className="card-hover" style={{ width: '200px' }} key={expansion.id}>
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
                  ? game.similar_games.map((similar_game: GameReviewsItems) => (
                      <Card className="card-hover" style={{ width: '200px' }} key={similar_game.id}>
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
                        </Nav.Link>
                      </Card>
                    ))
                  : null}
              </Row>
            </Row>
          ))}
        </Container>
        {/* EDIT Modal.*/}
        <Modal
          show={this.showModal}
          onHide={() => {
            this.showModal = !this.showModal;
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit review: {this.reviewEdit.review_title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              {this.reviewEditError ? <p style={{ color: 'red' }}>{this.reviewEditError}</p> : null}
              <Form id="ReviewForm">
                <Form.Group className="mb-3" controlId="formReviewEditTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    placeholder="Enter review title"
                    required
                    value={this.reviewEdit.review_title}
                    onChange={(event) => (this.reviewEdit.review_title = event.currentTarget.value)}
                  />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formReviewEditEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        required
                        value={this.reviewEdit.created_by_id}
                        onChange={(event) =>
                          (this.reviewEdit.created_by_id = event.currentTarget.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formReviewEditPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        required
                        value={this.reviewEdit.review_password}
                        onChange={(event) => {
                          this.reviewEdit.review_password = event.currentTarget.value;
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Select
                  className="me-sm-2"
                  id="fomrReviewEditScore"
                  required
                  value={this.reviewEdit.review_score}
                  onChange={(event) =>
                    (this.reviewEdit.review_score = Number(event.currentTarget.value))
                  }
                >
                  <option value="0">Select rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </Form.Select>
                <Form.Group className="mb-3" controlId="formReviewEditReviewText">
                  <Form.Label>Review text</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    required
                    value={this.reviewEdit.review_text}
                    onChange={(event) => (this.reviewEdit.review_text = event.currentTarget.value)}
                  />
                </Form.Group>
              </Form>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <div className="pull-left" style={{ margin: '0rem 12rem 0rem 0rem' }}>
              <Button
                variant="success"
                onClick={(event) => {
                  if (
                    this.reviewEdit.review_title != undefined &&
                    this.reviewEdit.review_title.length != 0 &&
                    this.reviewEdit.review_text != undefined &&
                    this.reviewEdit.review_text.length != 0 &&
                    this.reviewEdit.review_id != undefined &&
                    this.reviewEdit.review_id.length != 0 &&
                    this.reviewEdit.review_gameid != undefined &&
                    this.reviewEdit.review_gameid.length != 0 &&
                    this.reviewEdit.review_score != undefined &&
                    this.reviewEdit.review_score.length != 0 &&
                    this.reviewEdit.created_by_id != undefined &&
                    this.reviewEdit.created_by_id.length != 0 &&
                    this.reviewEdit.review_password != undefined &&
                    this.reviewEdit.review_password.length != 0
                  ) {
                    reviewService
                      .updateReview(
                        this.reviewEdit.review_title,
                        this.reviewEdit.review_text,
                        this.reviewEdit.review_id,
                        this.reviewEdit.review_gameid,
                        this.reviewEdit.review_score,
                        this.reviewEdit.created_by_id,
                        this.reviewEdit.review_password
                      )
                      .then(() => {
                        location.reload();
                      })
                      .catch(
                        (error) =>
                          (this.reviewEditError =
                            'An error occurred, could not update the review. Possible causes of the error may be incorrect email and or password. ')
                      );
                  } else {
                    this.reviewEditError =
                      'Some or all fields are missing. Please enter all fields.';
                  }
                }}
              >
                Save Changes
              </Button>{' '}
              <Button
                variant="danger"
                onClick={(event) => {
                  if (
                    this.reviewEdit.review_id != undefined &&
                    this.reviewEdit.review_id.length != 0 &&
                    this.reviewEdit.created_by_id != undefined &&
                    this.reviewEdit.created_by_id.length != 0 &&
                    this.reviewEdit.review_password != undefined &&
                    this.reviewEdit.review_password.length != 0
                  ) {
                    reviewService
                      .deleteReview(
                        this.reviewEdit.review_id,
                        this.reviewEdit.created_by_id,
                        this.reviewEdit.review_password
                      )
                      .then(() => {
                        location.reload();
                      })
                      .catch(
                        (error) =>
                          (this.reviewEditError =
                            'An error occurred, could not delete review. Possible causes of the error may be incorrect email and or password.')
                      );
                  } else {
                    this.reviewEditError =
                      'You must provide both email and password to be able to delete a review.';
                  }
                }}
              >
                Delete
              </Button>
            </div>
            <div className="d-flex justify-content-end flex-wrap bd-highlight example-parent">
              <Button
                style={{ float: 'right' }}
                variant="secondary"
                onClick={() => {
                  this.showModal = !this.showModal;
                }}
              >
                Close
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  getUpvote() {
    // Get review upvotes for user.
    reviewService
      .getUpvotes()
      .then((response) => (this.upvotes = response))
      .catch(() => null);
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
          .catch(() => null);
        reviewService
          .gameReviews(response[0].id)
          .then((response) => (this.gameReview = response))
          .catch(() => null);
      })
      .catch((error) => (this.errormsg = error));
    reviewService
      .getUpvotes()
      .then((results) => (this.upvotes = results))
      .catch(() => null);
  }
}

// Workaroud for this.props.match.params.offset problem: property 'match' does not exist on type Readonly
export class MainCarousel extends Component<any> {
  // Bare for å få random populære carousel items
  offset = Math.floor(Math.random() * 1000);
  games: GameReviewsItems[] = [];
  render() {
    if (this.games.length == 0) {
      return null;
    }
    return (
      <>
        <Container>
          <Carousel>
            {this.games.map((game) => (
              <Carousel.Item key={game.id}>
                {game.cover ? (
                  <img
                    src={String(game.cover.url).replace('t_thumb', 't_screenshot_huge')}
                    className="w-100 img-fluid"
                    alt={`${game.name} image.`}
                  />
                ) : null}
                <Carousel.Caption style={{ paddingBottom: '55px' }}>
                  <h1>{game.name}</h1>
                  <Button variant="dark">Read more</Button>{' '}
                  <Button variant="warning">
                    {game.total_rating
                      ? 'IGDB Score: ' + game.total_rating.toFixed(2) + '%'
                      : 'Review this game!'}
                  </Button>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </>
    );
  }
  mounted() {
    gameServices
      .getCarousel(this.offset)
      .then((response) => (this.games = response))
      .catch(() => null);
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
          <h4>Made by Group 3</h4>
          <p>© INFT2002 Fall 2021 - NTNU</p>
        </Container>
      </footer>
    );
  }
}

export class AddGame extends Component {
  errorMsg: string = '';
  submitMsg: string = '';
  formTitle: string = '';
  formDate: string = '';
  formPlatforms: string = '';
  formPublishers: string = '';
  formGenre: string = '';
  formDescription: string = '';
  constructor(props: any) {
    super(props);

    this.state = {
      name: '',
    };
  }

  handleChange = (event: any) => {
    this.setState({ name: event.target.value });
  };

  render() {
    return (
      <>
        <Container className="my-3 p-3 bg-dark rounded shadow-sm bg-primaty text-light">
          <h1 className="display-5"> Add a missing video game</h1>
          {this.errorMsg ? <p style={{ color: 'red' }}>{this.errorMsg}</p> : null}
          <Card title="Add a new video game">
            <Row>
              <Col>
                <Form>
                  <Form.Group className="mb-3" controlId="formGridTitle">
                    <Form.Label className="text-dark">Game title</Form.Label>
                    <Form.Control
                      type="input"
                      required
                      value={this.formTitle}
                      onChange={(event) => (this.formTitle = event.currentTarget.value)}
                      placeholder="F. ex. Battlefield 4"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGridTitle">
                    <Form.Label className="text-dark">Release date</Form.Label>
                    <Form.Control
                      type="input"
                      required
                      value={this.formDate}
                      onChange={(event) => (this.formDate = event.currentTarget.value)}
                      placeholder="MM/DD/YYYY"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGridTitle">
                    <Form.Label className="text-dark">Platforms</Form.Label>
                    <Form.Control
                      type="input"
                      required
                      value={this.formPlatforms}
                      onChange={(event) => (this.formPlatforms = event.currentTarget.value)}
                      placeholder="F. ex. PC (Windows) and/or PlayStation 3"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGridTitle">
                    <Form.Label className="text-dark">Developers / Publishers</Form.Label>
                    <Form.Control
                      type="input"
                      required
                      value={this.formPublishers}
                      onChange={(event) => (this.formPublishers = event.currentTarget.value)}
                      placeholder="F. ex. DICE and EA"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGridTitle">
                    <Form.Label className="text-dark">Genre(s)</Form.Label>
                    <Form.Control
                      type="input"
                      name="genre"
                      required
                      value={this.formGenre}
                      onChange={(event) => (this.formGenre = event.currentTarget.value)}
                      placeholder="F. ex. Shooter, Simulator or Strategy"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGridDesc">
                    <Form.Label className="text-dark">Game description</Form.Label>
                    <Form.Control
                      placeholder="Description of the video game"
                      as="textarea"
                      required
                      value={this.formDescription}
                      onChange={(event) => (this.formDescription = event.currentTarget.value)}
                      rows={3}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            {/* @ts-ignore */}
            <Button
              disabled={
                !this.formTitle ||
                !this.formDate ||
                !this.formPlatforms ||
                !this.formPublishers ||
                !this.formGenre ||
                !this.formDescription
              }
              onClick={(event) => {
                reviewService
                  .addGame(
                    this.formTitle,
                    this.formDate,
                    this.formPlatforms,
                    this.formPublishers,
                    this.formGenre,
                    this.formDescription
                  )
                  .then(() => {
                    // @ts-ignore - Ignores missing type on JavaScript function.
                    window.location.href('/#/submitgame/');
                    console.log('Alt ok');
                  })
                  .catch(() => {
                    this.errorMsg = 'An error occured, could not add game. Please try again.';
                  });
              }}
              variant="secondary"
              href="/#/submitgame/"
            >
              Submit new game
            </Button>
          </Card>
        </Container>
      </>
    );
  }

  mounted() {}
}

export class SubmitGame extends Component {
  render() {
    return (
      <>
        <Container>
          <Card title="noe nais">
            <Row>
              <Col>
                <Form>
                  <Form.Group className="mb-3" controlId="formGridTitle">
                    <Form.Label>
                      <h3>
                        The submission has been sent to the administrators for approval, and you can
                        expect the game to be added as soon as all the information has been
                        cross-checked. {'\n'} Thank you!{' '}
                      </h3>
                    </Form.Label>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Button variant="success" href="/#/addgames/">
              Add another game
            </Button>
          </Card>
        </Container>
      </>
    );
  }
  mounted() {}
}

// Workaroud for this.props.match.params.offset problem: property 'match' does not exist on type Readonly
export class SearchGame extends Component<any> {
  games: GameReviewsItems[] = [];
  searchQuery = '';
  offset: string | number | any = '';
  errormsg: string = '';
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
                          <div style={{ display: 'block' }}>
                            {game.genres
                              ? game.genres.map((genre: GameReviewsItems) => (
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
            <div className="d-grid gap-2">
              <br />
              <Button variant="success" size="lg" href="/#/addgames/">
                Can't find your game? Add it yourself!
              </Button>
            </div>
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

export class MainPage extends Component {
  offset: string | number | any = Math.floor(Math.random() * 1000);
  games: CarouselItems[] = [];

  render() {
    if (this.games.length == 0) {
      return null;
    }

    return (
      <>
        <Container className="bg-dark rounded shadow-sm bg-primaty text-light">
          <Card className="bg-dark">
            <Card.Body
              className="bg-dark rounded shadow-sm bg-primaty text-light"
              style={{ border: 'none' }}
            >
              <h1 className="display-5" style={{ textAlign: 'center' }}>
                Welcome to Game Review Service
              </h1>

              <Row>
                <Col style={{ textAlign: 'center' }}>
                  <p>
                    At Game Review Service, we have connected to the IGDB database and gotten
                    information about many different video games. You can search for a video game
                    you like, see the ratings from both IGDB and our users, read the reviews, see
                    similar video games and even write your own review! The more feedback we get,
                    the more users can find games of their liking. We hope you enjoy the stay at our
                    website!
                  </p>
                </Col>
              </Row>

              <Row className="d-flex justify-content-between" style={{ textAlign: 'center' }}>
                <Col>
                  <Button className="mainpagebutton" variant="secondary" href="/#/games/" size="lg">
                    View the highest rated games
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="mainpagebutton"
                    variant="secondary"
                    href="/#/search/"
                    size="lg"
                  >
                    Search for a video game
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="mainpagebutton"
                    variant="secondary"
                    href="/#/addgames/"
                    size="lg"
                  >
                    Add a new game to the library
                  </Button>
                </Col>
              </Row>
              <br></br>

              <Row>
                <Col style={{ textAlign: 'center' }}>
                  <h5>Some of the popular video games right now</h5>
                </Col>
              </Row>
              <br></br>
              <Row>
                <Col
                  className="bg-dark mx-auto"
                  xs={1}
                  md={5}
                  lg={7}
                  style={{ textAlign: 'center' }}
                >
                  <Carousel>
                    {this.games.map((game) => (
                      <Carousel.Item key={game.id}>
                        {game.cover ? (
                          <img
                            src={String(game.cover.url).replace('t_thumb', 't_screenshot_huge')}
                            className="w-100 img-fluid"
                            alt={`${game.name} image.`}
                          />
                        ) : null}
                        <Carousel.Caption style={{ paddingBottom: '55px' }}>
                          <h1>{game.name}</h1>
                          <Nav.Link href={'#/game/' + game.slug} className="search-link">
                            <Button variant="dark">Visit game page</Button>{' '}
                          </Nav.Link>
                        </Carousel.Caption>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </Col>
              </Row>
              <br></br>
            </Card.Body>
          </Card>
        </Container>
      </>
    );
  }

  mounted() {
    gameServices
      .getCarousel(this.offset)
      .then((response) => (this.games = response))
      .catch(() => null);
  }
}
