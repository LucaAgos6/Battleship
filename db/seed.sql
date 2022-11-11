--
-- PostgreSQL database dump
--

-- Dumped from database version 15.0
-- Dumped by pg_dump version 15.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE "Battleship";
--
-- Name: Battleship; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "Battleship" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Italian_Italy.1252';


ALTER DATABASE "Battleship" OWNER TO postgres;

\connect "Battleship"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: game; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game (
    id integer NOT NULL,
    player1 character varying(100),
    player2 character varying(100),
    game_status character varying(100),
    player_turn character varying(100),
    winner character varying(100),
    loser character varying(100),
    grid_dim smallint,
    grids json,
    log_moves json,
    game_date date,
    CONSTRAINT game_check CHECK ((((player_turn)::text = (player1)::text) OR ((player_turn)::text = (player2)::text))),
    CONSTRAINT game_check1 CHECK ((((player_turn)::text = (player1)::text) OR ((player_turn)::text = (player2)::text))),
    CONSTRAINT game_check2 CHECK ((((player_turn)::text = (player1)::text) OR ((player_turn)::text = (player2)::text))),
    CONSTRAINT game_game_status_check CHECK ((((game_status)::text = 'in progress'::text) OR ((game_status)::text = 'closed'::text))),
    CONSTRAINT game_grid_dim_check CHECK (((grid_dim >= 5) AND (grid_dim <= 20)))
);


ALTER TABLE public.game OWNER TO postgres;

--
-- Name: game_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.game_id_seq OWNER TO postgres;

--
-- Name: game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.game_id_seq OWNED BY public.game.id;


--
-- Name: leaderboard; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leaderboard (
    email character varying(100) NOT NULL,
    total_matches integer,
    wins integer,
    losses integer,
    win_ratio real,
    CONSTRAINT leaderboard_losses_check CHECK ((losses >= 0)),
    CONSTRAINT leaderboard_total_matches_check CHECK ((total_matches >= 0)),
    CONSTRAINT leaderboard_win_ratio_check CHECK (((win_ratio >= (0)::double precision) AND (win_ratio <= (1)::double precision))),
    CONSTRAINT leaderboard_wins_check CHECK ((wins >= 0))
);


ALTER TABLE public.leaderboard OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    email character varying(100) NOT NULL,
    role character varying(10),
    token numeric,
    CONSTRAINT users_role_check CHECK ((((role)::text = 'user'::text) OR ((role)::text = 'admin'::text)))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: game id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game ALTER COLUMN id SET DEFAULT nextval('public.game_id_seq'::regclass);


--
-- Data for Name: game; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game (id, player1, player2, game_status, player_turn, winner, loser, grid_dim, grids, log_moves, game_date) FROM stdin;
10	admin@mail.it	user1@mail.it	closed	admin@mail.it	user1@mail.it	admin@mail.it	5	{"grid1":[["W","W","W","W","D1"],["W","W","W","W","W"],["W","O","W","W","W"],["W","O","W","W","W"],["W","W","W","W","W"]],"grid2":[["W","W","W","X","O"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"]],"init_grid1":[["W","W","W","W","D1"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"]],"init_grid2":[["W","W","W","D1","W"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"]]}	{"moves":[{"player":"admin@mail.it","row":2,"col":1},{"player":"user1@mail.it","row":0,"col":4},{"player":"admin@mail.it","row":3,"col":1},{"player":"user1@mail.it","row":0,"col":3}]}	2022-11-05
52	user1@mail.it	user3@mail.it	closed	user1@mail.it	user3@mail.it	user1@mail.it	5	{"grid1":[["W","W","W","W","W"],["W","W","W","W","X"],["W","W","W","W","W"],["W","W","W","W","O"],["W","W","W","W","W"]],"grid2":[["W","W","W","O","W"],["W","D1","W","W","O"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"]],"init_grid1":[["W","W","W","W","W"],["W","W","W","W","D1"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"]],"init_grid2":[["W","W","W","W","W"],["W","D1","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"]]}	{"moves":[{"player":"user1@mail.it","row":0,"col":3},{"player":"user2@mail.it","row":3,"col":4},{"player":"user1@mail.it","row":1,"col":4},{"player":"user2@mail.it","row":1,"col":4}]}	2022-11-11
40	user4@mail.it	user5@mail.it	in progress	user5@mail.it	\N	\N	5	{"grid1":[["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"],["D1","W","W","W","W"]],"grid2":[["W","W","W","W","W"],["O","W","W","W","W"],["W","D1","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"]],"init_grid1":[["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"],["D1","W","W","W","W"]],"init_grid2":[["W","W","W","W","W"],["W","W","W","W","W"],["W","D1","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"]]}	{"moves":[{"player":"admin@mail.it","row":1,"col":0}]}	2022-11-05
41	user1@mail.it	user2@mail.it	closed	user1@mail.it	user2@mail.it	user1@mail.it	5	{"grid1":[["X","X","O","W","W"],["W","W","W","W","X"],["W","X","X","X","X"],["W","W","X","X","X"],["W","W","W","W","W"]],"grid2":[["X","X","X","O","O"],["W","X","X","X","X"],["W","W","W","W","W"],["W","O","W","W","X"],["W","W","C1","C1","W"]],"init_grid1":[["C1","C1","W","W","W"],["W","W","W","W","D1"],["W","A1","A1","A1","A1"],["W","W","B1","B1","B1"],["W","W","W","W","W"]],"init_grid2":[["B1","B1","B1","W","W"],["W","A1","A1","A1","A1"],["W","W","W","W","W"],["W","W","W","W","D1"],["W","W","C1","C1","W"]]}	{"moves":[{"player":"user1@mail.it","row":0,"col":0},{"player":"user2@mail.it","row":0,"col":0},{"player":"user1@mail.it","row":0,"col":1},{"player":"user2@mail.it","row":0,"col":1},{"player":"user1@mail.it","row":0,"col":2},{"player":"user2@mail.it","row":0,"col":2},{"player":"user1@mail.it","row":0,"col":3},{"player":"user2@mail.it","row":1,"col":4},{"player":"user1@mail.it","row":0,"col":4},{"player":"user2@mail.it","row":2,"col":1},{"player":"user1@mail.it","row":1,"col":4},{"player":"user2@mail.it","row":2,"col":2},{"player":"user1@mail.it","row":1,"col":3},{"player":"user2@mail.it","row":2,"col":3},{"player":"user1@mail.it","row":1,"col":2},{"player":"user2@mail.it","row":2,"col":4},{"player":"user1@mail.it","row":1,"col":1},{"player":"user2@mail.it","row":3,"col":2},{"player":"user1@mail.it","row":3,"col":1},{"player":"user2@mail.it","row":3,"col":3},{"player":"user1@mail.it","row":3,"col":4},{"player":"user2@mail.it","row":3,"col":4}]}	2022-11-06
42	user1@mail.it	AI	closed	AI	user1@mail.it	AI	5	{"grid1":[["X","O","O","X","X"],["O","B1","O","X","C1"],["O","B1","W","X","O"],["W","X","W","A1","W"],["O","O","O","W","O"]],"grid2":[["W","O","O","O","X"],["O","W","O","X","X"],["X","X","X","O","W"],["X","X","X","X","O"],["W","W","W","W","W"]],"init_grid1":[["D1","W","W","A1","C1"],["W","B1","W","A1","C1"],["W","B1","W","A1","W"],["W","B1","W","A1","W"],["W","W","W","W","W"]],"init_grid2":[["W","W","W","W","C1"],["W","W","W","D1","C1"],["B1","B1","B1","W","W"],["A1","A1","A1","A1","W"],["W","W","W","W","W"]]}	{"moves":[{"player":"user1@mail.it","row":0,"col":1},{"player":"AI","row":4,"col":1},{"player":"user1@mail.it","row":1,"col":0},{"player":"AI","row":4,"col":4},{"player":"user1@mail.it","row":1,"col":3},{"player":"AI","row":0,"col":4},{"player":"user1@mail.it","row":0,"col":4},{"player":"AI","row":0,"col":3},{"player":"user1@mail.it","row":1,"col":4},{"player":"AI","row":2,"col":0},{"player":"user1@mail.it","row":1,"col":2},{"player":"AI","row":1,"col":3},{"player":"user1@mail.it","row":2,"col":1},{"player":"AI","row":2,"col":4},{"player":"user1@mail.it","row":3,"col":1},{"player":"AI","row":0,"col":2},{"player":"user1@mail.it","row":3,"col":2},{"player":"AI","row":1,"col":0},{"player":"user1@mail.it","row":3,"col":3},{"player":"AI","row":1,"col":2},{"player":"user1@mail.it","row":3,"col":4},{"player":"AI","row":3,"col":1},{"player":"user1@mail.it","row":3,"col":0},{"player":"AI","row":4,"col":0},{"player":"user1@mail.it","row":2,"col":2},{"player":"AI","row":4,"col":2},{"player":"user1@mail.it","row":2,"col":3},{"player":"AI","row":0,"col":0},{"player":"user1@mail.it","row":0,"col":3},{"player":"AI","row":0,"col":1},{"player":"user1@mail.it","row":0,"col":2},{"player":"AI","row":2,"col":3},{"player":"user1@mail.it","row":2,"col":0}]}	2022-11-06
43	user1@mail.it	AI	closed	AI	user1@mail.it	AI	5	{"grid1":[["W","W","X","X","X"],["W","A1","A1","X","X"],["X","C1","O","W","O"],["O","O","W","O","X"],["O","O","O","O","O"]],"grid2":[["O","O","X","X","W"],["O","W","X","O","X"],["W","O","X","O","X"],["X","X","O","W","X"],["O","W","W","W","X"]],"init_grid1":[["W","W","B1","B1","B1"],["W","A1","A1","A1","A1"],["C1","C1","W","W","W"],["W","W","W","W","D1"],["W","W","W","W","W"]],"init_grid2":[["W","W","B1","D1","W"],["W","W","B1","W","A1"],["W","W","B1","W","A1"],["C1","C1","W","W","A1"],["W","W","W","W","A1"]]}	{"moves":[{"player":"user1@mail.it","row":0,"col":1},{"player":"AI","row":4,"col":3},{"player":"user1@mail.it","row":1,"col":0},{"player":"AI","row":2,"col":2},{"player":"user1@mail.it","row":1,"col":2},{"player":"AI","row":4,"col":2},{"player":"user1@mail.it","row":1,"col":3},{"player":"AI","row":1,"col":3},{"player":"user1@mail.it","row":2,"col":2},{"player":"AI","row":4,"col":1},{"player":"user1@mail.it","row":2,"col":3},{"player":"AI","row":4,"col":0},{"player":"user1@mail.it","row":3,"col":2},{"player":"AI","row":3,"col":4},{"player":"user1@mail.it","row":0,"col":2},{"player":"AI","row":3,"col":1},{"player":"user1@mail.it","row":1,"col":4},{"player":"AI","row":3,"col":0},{"player":"user1@mail.it","row":2,"col":4},{"player":"AI","row":2,"col":4},{"player":"user1@mail.it","row":3,"col":4},{"player":"AI","row":2,"col":0},{"player":"user1@mail.it","row":4,"col":4},{"player":"AI","row":0,"col":3},{"player":"user1@mail.it","row":2,"col":1},{"player":"AI","row":1,"col":4},{"player":"user1@mail.it","row":3,"col":0},{"player":"AI","row":0,"col":4},{"player":"user1@mail.it","row":4,"col":0},{"player":"AI","row":0,"col":2},{"player":"user1@mail.it","row":3,"col":1},{"player":"AI","row":3,"col":3},{"player":"user1@mail.it","row":0,"col":0},{"player":"AI","row":4,"col":4},{"player":"user1@mail.it","row":0,"col":3}]}	2022-11-08
51	admin@mail.it	user1@mail.it	closed	user1@mail.it	admin@mail.it	user1@mail.it	5	{"grid1":[["W","D1","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"]],"grid2":[["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","X"],["W","W","W","W","W"],["W","W","W","W","W"]],"init_grid1":[["W","D1","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","W"]],"init_grid2":[["W","W","W","W","W"],["W","W","W","W","W"],["W","W","W","W","D1"],["W","W","W","W","W"],["W","W","W","W","W"]]}	{"moves":[{"player":"admin@mail.it","row":2,"col":4}]}	2022-11-09
\.


--
-- Data for Name: leaderboard; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leaderboard (email, total_matches, wins, losses, win_ratio) FROM stdin;
user2@mail.it	1	1	0	1
AI	2	0	2	0
admin@mail.it	2	1	1	0.5
user3@mail.it	1	1	0	1
user1@mail.it	6	3	3	0.5
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (email, role, token) FROM stdin;
user6@mail.it	user	0
admin@mail.it	admin	48.39
user1@mail.it	user	49.58
user3@mail.it	user	49.98
user2@mail.it	user	49.89
AI	user	0
user4@mail.it	user	50
user5@mail.it	user	50
\.


--
-- Name: game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.game_id_seq', 52, true);


--
-- Name: game game_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_pkey PRIMARY KEY (id);


--
-- Name: leaderboard leaderboard_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaderboard
    ADD CONSTRAINT leaderboard_pkey PRIMARY KEY (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (email);


--
-- PostgreSQL database dump complete
--

