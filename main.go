package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	// "time"

	"github.com/adamveld12/svelte-go-template/client/public"
	"github.com/adamveld12/svelte-go-template/internal"
)

var (
	httpAddr = flag.String("http-address", ":8000", "Bind address for http server")
)

func main() {
	flag.Parse()

	httpApiHandler := internal.NewAPIHandler(public.Assets)
	httpServer := &http.Server{
		Addr:    *httpAddr,
		Handler: httpApiHandler,
	}

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)

	go runServer(httpServer)

	<-signals
	log.Println("Shutting down http server...")
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*9)
	defer cancel()
	if err := httpServer.Shutdown(ctx); err != nil {
		log.Fatalf("could not cleanly shutdown http server: %v", err)
	}
}

func runServer(server *http.Server) {
	log.Printf("Listening @ %s", *httpAddr)
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
