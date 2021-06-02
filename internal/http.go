package internal

import (
	"embed"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func NewAPIHandler(assets embed.FS) http.Handler {
	muxRoot := chi.NewRouter()

	muxRoot.Use(middleware.RequestID)
	muxRoot.Use(middleware.RealIP)
	muxRoot.Use(middleware.Logger)
	muxRoot.Use(middleware.Recoverer)
	muxRoot.Use(middleware.Timeout(time.Second * 5))

	muxRoot.Route("/api/v1", func(r chi.Router) {
		r.Use(middleware.AllowContentType("application/json; utf-8", "application/json"))
		r.Use(middleware.SetHeader("Content-Type", "application/json; utf-8"))
		r.Use(cors.Handler(cors.Options{
			AllowedOrigins:   []string{"http://*", "https://*"},
			AllowedMethods:   []string{"GET", "PUT", "DELETE", "POST", "OPTIONS"},
			AllowedHeaders:   []string{"Content-Type", "Accept"},
			AllowCredentials: false,
			MaxAge:           300,
		}))

		r.Get("/time", getTime)
	})

	fs := http.FS(assets)
	httpFileServer := http.FileServer(fs)
	muxRoot.Handle("/*", http.StripPrefix("/", http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		f, err := assets.Open(r.URL.Path)
		if os.IsNotExist(err) {
			r.URL.Path = "/"
		}

		if err == nil {
			f.Close()
		}

		log.Printf("%s - err: %v", r.URL.Path, err)

		httpFileServer.ServeHTTP(rw, r)
	})))
	return muxRoot
}

type GetTimeResponse struct {
	Now    JSONTime `json:"now"`
	NowUTC JSONTime `json:"nowUTC"`
}

type JSONTime time.Time

func (t JSONTime) MarshalJSON() ([]byte, error) {
	stamp := fmt.Sprintf("\"%s\"", time.Time(t).Format(time.RFC3339))
	return []byte(stamp), nil
}

func getTime(rw http.ResponseWriter, r *http.Request) {
	responsePayload := GetTimeResponse{
		Now:    JSONTime(time.Now()),
		NowUTC: JSONTime(time.Now().UTC()),
	}

	if err := json.NewEncoder(rw).Encode(&responsePayload); err != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		if _, werr := rw.Write([]byte(err.Error())); werr != nil {
			log.Printf("ERROR WRITING TO CLIENT: %v", werr)
		}
	}
}
