package client

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

// RestClient represent REST api clinet sturcture
type RestClient struct {
	MessagesResourceURI string
	HealthResoruceURI   string
	HTTPClient          *http.Client
}

/*
// ResourcePath defines resrouces in server
type ResourcePath struct {
	Message string
	Health  string
}
*/

// Message represent a message details
type Message struct {
	ID            string `json:"_id"`
	Msg           string `json:"message"`
	IsPalindrome  bool   `json:"isPalindrome"`
	Length        int64  `json:"length"`
	CreatedAt     string `json:"createdAt"`
	LastUpdatedAt string `json:"lastUpdatedAt"`
}

// ListMessages represents list reponse
type ListMessages struct {
	Msgs          []Message `json:"messages"`
	Page          int       `json:"page"`
	TotalPage     int       `json:"totalPages"`
	TotalMessages int       `json:"totalMessages"`
	HasNextPage   bool      `json:"hasNextPage"`
}

// CreateMessage create a new message with the provided string as jsonBody
func (c *RestClient) CreateMessage(jsonBody []byte) (*string, error) {
	fmt.Println(string(jsonBody))
	req, err := http.NewRequest("POST", c.MessagesResourceURI, bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	//fmt.Println("response status: ", resp.Status)
	//fmt.Println("response header: ", resp.Header.Get("Location"))
	if resp.StatusCode != 201 {
		return nil, errors.New("Error happend. Response status code: " + resp.Status)
	}
	// header value is like /messages/e14dc614f9284216ae8771d20f4d9b0d
	mid := strings.Split(resp.Header.Get("Location"), "/messages/")[1]
	return &mid, nil
}

// GetMessage returns a detail of the specified message with the provided msgID
func (c *RestClient) GetMessage(msgID string) (*Message, error) {
	req, err := http.NewRequest("GET", c.MessagesResourceURI+"/"+msgID, nil)
	req.Header.Set("Content-Type", "application/json")
	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	//fmt.Println("response status: ", resp.Status)
	//fmt.Println("response header: ", resp.Header.Get("Location"))
	if resp.StatusCode == 404 {
		return nil, errors.New("Message Not found with the ID: " + msgID)
	}
	body, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode != 200 {
		return nil, errors.New("Error happened while getting the message with ID: " + string(body))
	}
	msg := &Message{}
	json.Unmarshal(body, msg)
	return msg, nil
}

// DeleteMessage returns a detail of the specified message with the provided msgID
func (c *RestClient) DeleteMessage(msgID string) (bool, error) {
	req, err := http.NewRequest("DELETE", c.MessagesResourceURI+"/"+msgID, nil)
	req.Header.Set("Content-Type", "application/json")
	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()
	//fmt.Println("response status: ", resp.Status)
	//fmt.Println("response header: ", resp.Header.Get("Location"))
	if resp.StatusCode == 404 {
		return false, errors.New("Message Not found with the ID: " + msgID)
	}
	if resp.StatusCode != 204 {
		return false, errors.New("Error happened while deleting the message with ID: " + resp.Status)
	}
	return true, nil
}

// UpdateMessage updates a message with the provided message id and message
func (c *RestClient) UpdateMessage(msgID string, jsonBody []byte) (int, error) {
	req, err := http.NewRequest("PATCH", c.MessagesResourceURI+"/"+msgID, bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()
	//fmt.Println("response status: ", resp.Status)
	//fmt.Println("response header: ", resp.Header.Get("Location"))
	if resp.StatusCode != 204 {
		return 0, errors.New("Error happend. Response status code: " + resp.Status)
	}
	return resp.StatusCode, nil
}

// ListMessages returns all the messages stored in the server
func (c *RestClient) ListMessages(resourceURI *string) (*ListMessages, error) {
	req, err := http.NewRequest("GET", *resourceURI, nil)
	req.Header.Set("Content-Type", "application/json")
	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	//fmt.Println("response status: ", resp.Status)
	//fmt.Println("response header: ", resp.Header.Get("Location"))
	body, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode != 200 {
		return nil, errors.New("Error happened while getting the message with ID: " + string(body))
	}
	msgs := &ListMessages{}
	json.Unmarshal(body, msgs)
	return msgs, nil
}

// ListMessagesWithAllFilter returns all the messages stored in the server
func (c *RestClient) ListMessagesWithAllFilter(page, limit int, palindrome *string) (*ListMessages, error) {
	uri := fmt.Sprintf("%s?page=%d&limit=%d", c.MessagesResourceURI, page, limit)

	if *palindrome != "" {
		uri = uri + "&palindrome=" + *palindrome
	}
	fmt.Println(uri)
	return c.ListMessages(&uri)
}
