package cmd

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/spf13/cobra"
)

var updateCmd = &cobra.Command{
	Use:   "update [message Id] [new message]",
	Short: "Update a message",
	Long:  "Update  a message with the provided id",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) != 2 {
			return errors.New("requires a message ID and a message conent")
		}
		return nil
	},
	Run: updateMessage,
}

func init() {
	RootCmd.AddCommand(updateCmd)
}

func updateMessage(cmd *cobra.Command, args []string) {
	msg := &uMessage{Msg: args[1]}
	b, err := json.Marshal(msg)
	if err != nil {
		fmt.Println(err)
		return
	}
	_, err = rClient.UpdateMessage(args[0], b)
	if err != nil {
		fmt.Println("Error happened", err)
		return
	}
	fmt.Println("Message has been updated with the ID: " + args[0])
}
