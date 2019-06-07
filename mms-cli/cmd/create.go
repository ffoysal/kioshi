package cmd

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/spf13/cobra"
)

// Create the command
var createCmd = &cobra.Command{
	Use:   "create [message]",
	Short: "Create a message",
	Long:  "Create a message with the given text and using POST method",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) != 1 {
			return errors.New("requires a message to be created")
		}
		return nil
	},
	Run: createMessage,
}

// register the command. This method called by cobra
func init() {
	RootCmd.AddCommand(createCmd)
}

// message body for the post and patch operation
type uMessage struct {
	Msg string `json:"message"`
}

// make request to api to create a message
func createMessage(cmd *cobra.Command, args []string) {
	msg := &uMessage{Msg: args[0]}
	b, err := json.Marshal(msg)
	if err != nil {
		fmt.Println(err)
		return
	}
	id, err := rClient.CreateMessage(b)
	if err != nil {
		fmt.Println("Error happened", err)
		return
	}
	fmt.Println("Message has been created with the ID: " + *id)
}
