package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/olahol/melody"
)

func main() {
	r := mux.NewRouter()
	m := melody.New()

	r.HandleFunc(`/ws`, func(w http.ResponseWriter, r *http.Request) {
		e := m.HandleRequest(w, r)
		if e != nil {
			log.Println(e)
		}
	})

	m.HandleConnect(func(s *melody.Session) {
		log.Printf("(%s) join\n", s.RemoteAddr())
	})

	m.HandleDisconnect(func(s *melody.Session) {
		log.Printf("(%s) disconnect\n", s.RemoteAddr())
	})

	m.HandleMessage(func(s *melody.Session, message []byte) {
		log.Printf("(%s) message (%s)\n", s.RemoteAddr(), string(message))
		if false {
			s.CloseWithMsg(websocket.FormatCloseMessage(websocket.ClosePolicyViolation, "bye"))
		}
	})

	go func() {
		_addr := ":8080"

		e := r.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
			template, e := route.GetPathTemplate()
			if e != nil {
				return e
			}
			log.Println("http://localhost" + _addr + template)
			return nil
		})

		if e != nil {
			log.Panic(e)
		}

		e = http.ListenAndServe(_addr, r)
		if e != nil && e != http.ErrServerClosed {
			log.Panic(e)
		}
	}()

	q := make(chan os.Signal, 1)
	signal.Notify(q, syscall.SIGINT, syscall.SIGTERM)
	<-q
}
